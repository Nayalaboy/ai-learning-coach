from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from  openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
print("Loaded API KEY:", os.getenv("OPENAI_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class LearningRequest(BaseModel):
    topic: str


@app.post("/generate-roadmap")
async def generate_roadmap(request: LearningRequest):
    if not request.topic:
        raise HTTPException(status_code =400, detail = "Please provide a topic" )
    try:
        prompt = (
            f"You are an expert AI career coach. A user wants to become proficient in {request.topic}. "
            "Create a clear and practical 3-step learning roadmap with resources, estimated timeline, "
            "and the most important concepts to master."
        )
        response = client.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [{"role":"user", "content": prompt}],
            temperature = 0.7
        ) 
        roadmap = response.choices[0].message.content
        return {"roadmap": roadmap}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")

@app.get("/check-key")
def check_key():
    return{
        "key": os.getenv("OPENAI_API_KEY")
    }