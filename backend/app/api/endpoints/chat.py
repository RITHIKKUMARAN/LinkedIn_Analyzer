from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services import crud
from app.services.ai_analyst import AiAnalyst

router = APIRouter()
analyst = AiAnalyst()

class ChatRequest(BaseModel):
    page_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_analyst(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    # 1. Get Page Context
    page = await crud.get_page_by_linkedin_id(db, request.page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page context not found")
    
    # Simple context dict
    context = {
        "name": page.name,
        "description": page.description,
        "industry": page.industry,
        "follower_count": page.follower_count,
        "head_count": page.head_count,
        "website": page.website,
        "posts": [p.content for p in page.posts[:5]] if page.posts else []
    }
    
    # 2. Generate Response
    response_text = await analyst.generate_response(context, request.message)
    
    return ChatResponse(response=response_text)
