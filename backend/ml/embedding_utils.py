from openai import OpenAI
client = OpenAI()

def get_embedding(text):
    response = client.embeddings.create(

        model = "text-embedding-3-small",
        input  = text
    )
    return response.data[0].embedding

def format_job_for_embedding(job):
    return (
        f"Title: {job['title']}\n"
        f"Company: {job['company']}\n"
        f"Location: {job['location']}\n"
        f"Department: {job.get('department', '')}\n"
        f"Requirements: {'; '.join(job['requirements'])}"
    )