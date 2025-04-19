from fastapi import UploadFile, File, Form, FastAPI, HTTPException
from typing import Annotated, Optional
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import pdfplumber  
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.post("/smart-coach")
async def smart_coach(
    question: Annotated[Optional[str], Form()] = None,
    goal: Annotated[Optional[str], Form()] = None,
    file: Optional[UploadFile] = File(None),
    model: Annotated[Optional[str], Form()] = "gpt-4o"

):
    resume_text = ""

    if file:
        contents = await file.read()
        with open("temp_resume.pdf", "wb") as f:
            f.write(contents)
        with pdfplumber.open("temp_resume.pdf") as pdf:
            resume_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        os.remove("temp_resume.pdf")


    # 🧠 Build prompt dynamically
    region_context = (
    "The user is based in West Africa. Please consider regional job opportunities, affordable certifications, and accessible online resources.\n"
    "Highlight programs like ALX Africa, Andela, Zindi, MEST, and Google Africa Developer Scholarship. "
    "Respond with empathy toward limited infrastructure (internet access, power). "
    "Feel free to respond in French if the resume is in French.\n\n"
    )

    prompt = "You are an expert AI career coach.\n\n"

    if resume_text:
        prompt += f"Here is the user's resume:\n{resume_text}\n\n"

    if question:
        prompt += f"The user asked the following question:\n{question}\n\n"

    if goal:
        prompt += f"The user's career goal is to become proficient in: {goal}.\n"
        prompt += "Create a 3-step learning roadmap including skills, resources, trainings' link and timeline.\n"

    if not question and not goal:
        raise HTTPException(status_code=400, detail="Please provide a goal or a question.")

    # 🔮 Send to OpenAI
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt+region_context}],
        temperature=0.7
    )
    answer = response.choices[0].message.content

    return {"answer": answer}