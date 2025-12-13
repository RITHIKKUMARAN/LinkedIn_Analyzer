from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services import crud
from app.schemas import schemas
from app.services.scraper import LinkedInScraper
from typing import Optional, List

router = APIRouter()

# Instantiate scraper (Singleton pattern ideally, or per request)
scraper = LinkedInScraper()


@router.get("/pages", response_model=dict)
async def list_pages(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    List all company pages with pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return (1-100)
    """
    pages = await crud.get_all_pages(db, skip=skip, limit=limit)
    total = await crud.count_pages(db)
    
    return {
        "items": [schemas.PageDetail.model_validate(p) for p in pages],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.get("/pages/search", response_model=dict)
async def search_pages(
    name: Optional[str] = Query(None, description="Search by company name (partial match)"),
    industry: Optional[str] = Query(None, description="Filter by industry (partial match)"),
    min_followers: Optional[int] = Query(None, ge=0, description="Minimum follower count"),
    max_followers: Optional[int] = Query(None, ge=0, description="Maximum follower count"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    Search and filter company pages.
    
    - **name**: Partial match on company name
    - **industry**: Partial match on industry
    - **min_followers**: Minimum follower count
    - **max_followers**: Maximum follower count
    - **skip/limit**: Pagination
    """
    pages = await crud.search_pages(
        db,
        name=name,
        industry=industry,
        min_followers=min_followers,
        max_followers=max_followers,
        skip=skip,
        limit=limit
    )
    total = await crud.count_search_results(
        db,
        name=name,
        industry=industry,
        min_followers=min_followers,
        max_followers=max_followers
    )
    
    return {
        "items": [schemas.PageDetail.model_validate(p) for p in pages],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total,
        "filters": {
            "name": name,
            "industry": industry,
            "min_followers": min_followers,
            "max_followers": max_followers
        }
    }


@router.get("/pages/{page_id}", response_model=schemas.PageDetail)
async def get_page_details(
    page_id: str, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Get details of a specific company page by LinkedIn ID.
    
    If the page is not in the database, it will be scraped in real-time.
    """
    # 1. Check DB
    db_page = await crud.get_page_by_linkedin_id(db, page_id)
    
    # 2. If exists, return (maybe trigger update in background if old?)
    if db_page:
        # Check if we have posts/employees. If not, this might be a "broken" cached page.
        should_refetch = False
        
        if not db_page.posts:
             scraped_posts = await scraper.scrape_posts(page_id)
             if scraped_posts:
                post_schemas = [schemas.PostCreate(**p) for p in scraped_posts]
                await crud.create_posts(db, db_page.id, post_schemas)
                should_refetch = True

        if not db_page.employees:
             scraped_employees = await scraper.scrape_employees(page_id)
             if scraped_employees:
                emp_schemas = [schemas.EmployeeCreate(**e) for e in scraped_employees]
                await crud.create_employees(db, db_page.id, emp_schemas)
                should_refetch = True
        
        if should_refetch:
             # Reload completely
             return await crud.get_page_by_linkedin_id(db, page_id)

        return db_page

    # 3. If missing, Scrape
    try:
        scraped_data = await scraper.scrape_page_details(page_id)
        if not scraped_data:
             raise HTTPException(status_code=404, detail="Page not found or could not be scraped")
             
        # Create page with duplicate key handling
        page_create = schemas.PageCreate(**scraped_data)
        try:
            new_page = await crud.create_page(db, page_create)
        except Exception as db_error:
            # Handle duplicate key error - page was inserted by another request
            if "already exists" in str(db_error) or "duplicate key" in str(db_error).lower():
                # Rollback and fetch existing
                await db.rollback()
                existing_page = await crud.get_page_by_linkedin_id(db, page_id)
                if existing_page:
                    return existing_page
            raise
        
        # Trigger scraping for posts and employees
        scraped_posts = await scraper.scrape_posts(page_id)
        if scraped_posts:
            post_schemas = [schemas.PostCreate(**p) for p in scraped_posts]
            await crud.create_posts(db, new_page.id, post_schemas)

    
        # Scrape and save employees
        scraped_employees = await scraper.scrape_employees(page_id)
        if scraped_employees:
            emp_schemas = [schemas.EmployeeCreate(**e) for e in scraped_employees]
            await crud.create_employees(db, new_page.id, emp_schemas)
        
        # Re-fetch the page to ensure relationships are eagerly loaded
        return await crud.get_page_by_linkedin_id(db, page_id)
        
    except HTTPException:
        raise
    except Exception as e:
        # Try to return existing page if insert failed due to race condition
        existing = await crud.get_page_by_linkedin_id(db, page_id)
        if existing:
            return existing
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pages/{page_id}/posts", response_model=dict)
async def get_page_posts(
    page_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(15, ge=1, le=50, description="Maximum number of posts to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get posts for a specific company page with pagination.
    
    - Returns the most recent posts first
    - **limit**: Max 50 posts per request, default 15
    """
    # First ensure the page exists
    db_page = await crud.get_page_by_linkedin_id(db, page_id)
    if not db_page:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' not found. Fetch it first via GET /pages/{page_id}")
    
    posts = await crud.get_posts_by_page(db, db_page.id, limit=limit, offset=skip)
    total = await crud.count_posts_by_page(db, db_page.id)
    
    return {
        "page_id": page_id,
        "items": [schemas.Post.model_validate(p) for p in posts],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.get("/posts/{post_id}", response_model=schemas.PostWithComments)
async def get_post_with_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific post with its comments.
    """
    post = await crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/posts/{post_id}/comments", response_model=dict)
async def get_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get comments for a specific post with pagination.
    """
    # Verify post exists
    post = await crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = await crud.get_comments_by_post(db, post_id, limit=limit, offset=skip)
    
    return {
        "post_id": post_id,
        "items": [schemas.Comment.model_validate(c) for c in comments],
        "total": len(post.comments) if post.comments else 0,
        "skip": skip,
        "limit": limit
    }
