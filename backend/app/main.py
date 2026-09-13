from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat  # ya jahan bhi aapne chat.py rakha hai

app = FastAPI(title="NCRB Crime Graph AI Backend")

# Enable CORS for frontend communication (React port 3000 ya jo bhi ho)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me specific domain de sakte hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the AI chat router
app.include_router(chat.router)