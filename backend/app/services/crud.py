from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.models import CompanyPage, Post, Employee
from app.schemas import schemas
from datetime import datetime

async def get_page_by_linkedin_id(db: AsyncSession, linkedin_id: str):
    result = await db.execute(
        select(CompanyPage)
        .options(selectinload(CompanyPage.posts), selectinload(CompanyPage.employees))
        .filter(CompanyPage.linkedin_id == linkedin_id)
    )
    return result.scalars().first()

async def create_page(db: AsyncSession, page: schemas.PageCreate):
    db_page = CompanyPage(**page.model_dump())
    db.add(db_page)
    await db.commit()
    await db.refresh(db_page)
    return db_page

async def update_page_details(db: AsyncSession, page_id: int, page_data: dict):
    # Retrieve page to update
    result = await db.execute(select(CompanyPage).filter(CompanyPage.id == page_id))
    db_page = result.scalars().first()
    if db_page:
        for key, value in page_data.items():
            setattr(db_page, key, value)
        db_page.last_scraped_at = datetime.now()
        await db.commit()
        await db.refresh(db_page)
    return db_page

async def create_posts(db: AsyncSession, page_id: int, posts: list[schemas.PostCreate]):
    # This might need basic dedup logic based on post_url
    created_posts = []
    for post in posts:
        # Check if exists
        result = await db.execute(select(Post).filter(Post.post_url == post.post_url))
        existing = result.scalars().first()
        if not existing:
            db_post = Post(page_id=page_id, **post.model_dump())
            db.add(db_post)
            created_posts.append(db_post)
    
    if created_posts:
        await db.commit()
    return created_posts


async def create_employees(db: AsyncSession, page_id: int, employees: list[schemas.EmployeeCreate]):
    created_employees = []
    for emp in employees:
        # Basic dedup: check by name and page_id (not perfect but suffices for now)
        result = await db.execute(select(Employee).filter(Employee.page_id == page_id, Employee.name == emp.name))
        existing = result.scalars().first()
        if not existing:
            db_emp = Employee(page_id=page_id, **emp.model_dump())
            db.add(db_emp)
            created_employees.append(db_emp)
    
    if created_employees:
        await db.commit()
    return created_employees

async def get_posts_by_page(db: AsyncSession, page_id: int, limit: int = 15, offset: int = 0):
    result = await db.execute(select(Post).filter(Post.page_id == page_id).limit(limit).offset(offset).order_by(Post.created_at.desc()))
    return result.scalars().all()
