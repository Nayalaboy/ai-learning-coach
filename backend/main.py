# backend/main.py

from fastapi import UploadFile, File, Form, FastAPI, HTTPException
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok"}

@app.post("/smart-coach")
async def smart_coach(
    question: Optional[str] = Form(None),
    goal: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    model: str = Form("gpt-4o")
):
    import pdfplumber

    if not (file or question or goal):
        raise HTTPException(400, "Please provide a PDF, a question, or a goal.")

    resume_text = ""
    if file:
        if file.content_type != "application/pdf":
            raise HTTPException(415, "Only PDFs are supported")
        contents = await file.read()
        tmp = "temp_resume.pdf"
        with open(tmp, "wb") as f:
            f.write(contents)
        try:
            with pdfplumber.open(tmp) as pdf:
                resume_text = "\n".join(
                    page.extract_text() or "" for page in pdf.pages
                )
        finally:
            os.remove(tmp)

    region_context = (
        "You are an expert AI career coach with deep knowledge of West African programs "
        "(ALX Africa, Andela, Zindi, MEST, Google Africa) and infrastructure constraints. "
        "You can answer in English or French.\n\n"
    )

    parts = [region_context]

    if resume_text:
        parts.append(f"Resume:\n{resume_text}")

    if question:
        parts.append(f"Question:\n{question}")

    if goal:
        parts.append(
            f"Goal:\n{goal}\n\n"
            "Please create a 3‑step learning roadmap with key skills, resources (with links), and an estimated timeline."
        )

    prompt = "\n\n".join(parts)

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    answer = response.choices[0].message.content

    return {"answer": answer}
