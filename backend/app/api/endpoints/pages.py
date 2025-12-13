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
        # Fetch relationships to construct full detail
        # For now, just simplistic fetch. 
        # In real world, we might want to lazy load or join
        # But for the schema PageDetail, we need them loaded.
        # Async CRUD needs to handle loading if not eager.
        
        # Manually fetching posts for the response since lazy loading in async is tricky without proper setup
        posts = await crud.get_posts_by_page(db, db_page.id)
        db_page.posts = posts
        return db_page

    # 3. If missing, Scrape
    try:
        scraped_data = await scraper.scrape_page_details(page_id)
        if not scraped_data:
             raise HTTPException(status_code=404, detail="Page not found or could not be scraped")
             
        # Create page
        page_create = schemas.PageCreate(**scraped_data)
        new_page = await crud.create_page(db, page_create)
        
        # Trigger background scrape for posts and employees to not block response too long
        # Or scrape posts now if critical.
        # Let's scrape posts now for the "demo ready" feel where you see data immediately.
        
        # Trigger scraping for posts and employees
        scraped_posts = await scraper.scrape_posts(page_id)
        if scraped_posts:
            # We need to create post objects. 
            # Note: The scraper returns dicts, we need to convert to schemas if crud expects schemas
            # crud.create_posts expects list[schemas.PostCreate]
            post_schemas = [schemas.PostCreate(**p) for p in scraped_posts]
            await crud.create_posts(db, new_page.id, post_schemas)

    
        # Scrape and save employees
        scraped_employees = await scraper.scrape_employees(page_id)
        if scraped_employees:
            emp_schemas = [schemas.EmployeeCreate(**e) for e in scraped_employees]
            await crud.create_employees(db, new_page.id, emp_schemas)
        
        # Re-fetch the page to ensure relationships are eagerly loaded (prevents MissingGreenlet error)
        # and to match the PageDetail schema
        return await crud.get_page_by_linkedin_id(db, page_id)
        
    except Exception as e:
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
