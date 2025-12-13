from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CompanyPage(Base):
    __tablename__ = "company_pages"

    id = Column(Integer, primary_key=True, index=True)
    linkedin_id = Column(String, unique=True, index=True) # The public handle e.g. 'deepsolv' or internal ID if available
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    follower_count = Column(Integer, default=0)
    head_count = Column(Integer, default=0)
    founded = Column(String, nullable=True)
    specialties = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    # Metadata
    last_scraped_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    posts = relationship("Post", back_populates="page", cascade="all, delete-orphan")
    employees = relationship("Employee", back_populates="page", cascade="all, delete-orphan")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("company_pages.id"))
    
    content = Column(Text, nullable=True)
    post_url = Column(String, unique=True, index=True)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    posted_at_timestamp = Column(DateTime(timezone=True), nullable=True) # Original post date if available
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    page = relationship("CompanyPage", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    
    author_name = Column(String, nullable=True)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("Post", back_populates="comments")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("company_pages.id"))
    
    name = Column(String, index=True)
    role = Column(String, nullable=True)
    location = Column(String, nullable=True)
    profile_url = Column(String, nullable=True)
    
    page = relationship("CompanyPage", back_populates="employees")
