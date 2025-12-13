from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services import crud
from app.schemas import schemas
from app.services.scraper import LinkedInScraper

router = APIRouter()

# Instantiate scraper (Singleton pattern ideally, or per request)
scraper = LinkedInScraper()

@router.get("/pages/{page_id}", response_model=schemas.PageDetail)
async def get_page_details(
    page_id: str, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # 1. Check DB
    db_page = await crud.get_page_by_linkedin_id(db, page_id)
    
    # 2. If exists, return (maybe trigger update in background if old?)
    if db_page:
        # Check if we have posts/employees. If not, this might be a "broken" cached page.
        # Trigger a repair scrape.
        
        # We need to manually load them if they aren't loaded, but selectinload in crud should have handled it.
        # So if len is 0, we can assume we need to scrape (or there really are 0 posts).
        # For this "Demo" app, assuming 0 posts means "we missed them last time" is safer.
        
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

@router.get("/pages", response_model=list[schemas.Page])
async def list_pages(
    skip: int = 0, 
    limit: int = 10, 
    db: AsyncSession = Depends(get_db)
):
    # Implement listing logic in CRUD
    # returning empty list for now
    return []
