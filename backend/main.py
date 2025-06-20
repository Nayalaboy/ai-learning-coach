from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import openai
from openai import OpenAI
import os
import json
import tempfile
import re
from dotenv import load_dotenv
import fitz 
from ml.job_matcher import find_similar_jobs

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in .env")

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
client = OpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "✅ AI Resume Coach backend is running."}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(None),
    question: str = Form(None)
):
    
    # If only question is provided, no resume
    if not file and question:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": ("You are a helpful and professional AI career coach. "
    "When asked a question, respond in a clear and structured roadmap format, broken into these sections: "
    "1. Current Strengths (if resume is provided), 2. Actionable Steps (bullet style), 3. Final Advice. "
    "Keep responses concise but personalized. Use markdown styling like bold or headers if needed.")},
                {"role": "user", "content": question},
            ],
            temperature=0.7,
        )
        return {"answer": response.choices[0].message.content}

    # If a resume file is uploaded (with or without question)
    if file:
        contents = await file.read()
        with open("temp_resume.pdf", "wb") as f:
            f.write(contents)

        text = extract_text_from_pdf("temp_resume.pdf")
        os.remove("temp_resume.pdf")

        messages = [
            {"role": "system", "content": "You are a helpful AI coach who gives career feedback based on resumes and goals."},
            {"role": "user", "content": f"My resume: {text}"},
        ]

        if question:
            messages.append({"role": "user", "content": f"My goal is: {question}"})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
        )

        return {"answer": response.choices[0].message.content}

    return {"answer": "No input provided."}

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

@app.post("/recommend-roles")
async def recommend_roles(input_text: str = Form(...)):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    job_data_path = os.path.join(BASE_DIR, "ml", "data", "embedded_jobs.json")
    matches = find_similar_jobs(input_text, job_data_path)
    return {"matches": matches}