# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from openai import OpenAI
import os
import json
import tempfile
import re
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="AI Learning Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Step(BaseModel):
    title: str
    description: str
    links: List[HttpUrl] = []

class CoachResponse(BaseModel):
    steps: List[Step]

@app.get("/", tags=["Health"])
async def health():
    return {"status": "ok"}

@app.post("/smart-coach", response_model=CoachResponse, tags=["Coach"])
async def smart_coach(
    question: Optional[str] = Form(None),
    goal: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    model: str = Form("gpt-4o")
):
    import pdfplumber  # lazy‑load so docs start fast

    if not (file or question or goal):
        raise HTTPException(400, "Please provide a PDF, a question, or a goal.")

    # Extract resume text
    resume_text = ""
    if file:
        if file.content_type != "application/pdf":
            raise HTTPException(415, "Only PDFs are supported.")
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        try:
            with pdfplumber.open(tmp_path) as pdf:
                resume_text = "\n".join(p.extract_text() or "" for p in pdf.pages)
        finally:
            os.remove(tmp_path)

    # Instruct the model to emit pure JSON
    system_msg = (
        "You are an expert AI career coach aware of West African programs "
        "(ALX, Andela, Zindi, MEST, Google Africa). Respond with valid JSON only, "
        "in this exact format:\n"
        '{ "steps": [ { "title": "...", "description": "...", "links": ["https://..."] }, ... ] }\n'
    )

    # Build user prompt
    user_parts = []
    if resume_text:
        user_parts.append(f"Resume:\n{resume_text}")
    if question:
        user_parts.append(f"Question:\n{question}")
    if goal:
        user_parts.append(
            f"Goal:\n{goal}\n\nProvide a 3‑step learning roadmap with skills, resources, and timeline."
        )
    prompt = "\n\n".join(user_parts)

    # Call OpenAI
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=700
    )

    raw = resp.choices[0].message.content.strip()
    print("Raw model output:", raw)

    # Extract JSON substring
    match = re.search(r"(\{.*\})", raw, re.DOTALL)
    if not match:
        raise HTTPException(500, f"Invalid JSON from model: {raw}")

    json_str = match.group(1)
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Invalid JSON from model: {e}")

    return data
