from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.assistant import CrimeDataAssistant

router = APIRouter()
assistant = CrimeDataAssistant()

class QueryRequest(BaseModel):
    query: str

@router.post("/chat")
def chat_with_ai(request: QueryRequest):
    try:
        response = assistant.query(request.query)
        return {"status": "success", "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))