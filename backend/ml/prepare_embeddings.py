import json
from embedding_utils import get_embedding, format_job_for_embedding

input_file = "ml/data/jobs.json"
output_file = "ml/data/embedded_jobs.json"

with open(input_file, "r") as f:
    jobs = json.load(f)

for job in jobs:
    job["embedding_text"] = format_job_for_embedding(job)
    job["embedding"] = get_embedding(job["embedding_text"])

with open(output_file, 'w') as f:
    json.dump(jobs, f, indent=2)


