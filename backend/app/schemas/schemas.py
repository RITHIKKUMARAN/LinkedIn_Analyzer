from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class PageBase(BaseModel):
    linkedin_id: str
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    follower_count: Optional[int] = 0
    head_count: Optional[int] = 0
    founded: Optional[str] = None
    specialties: Optional[str] = None
    profile_image_url: Optional[str] = None

class PageCreate(PageBase):
    pass

class Page(PageBase):
    id: int
    created_at: datetime
    last_scraped_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PostBase(BaseModel):
    content: Optional[str] = None
    post_url: str
    like_count: int = 0
    comment_count: int = 0
    posted_at_timestamp: Optional[datetime] = None

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    page_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class EmployeeBase(BaseModel):
    name: str
    role: Optional[str] = None
    location: Optional[str] = None
    profile_url: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    page_id: int

    model_config = ConfigDict(from_attributes=True)
    
class PageDetail(Page):
    posts: List[Post] = []
    employees: List[Employee] = []
