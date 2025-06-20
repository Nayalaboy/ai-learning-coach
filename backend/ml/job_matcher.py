import json
import numpy as np
from ml.embedding_utils import get_embedding

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def find_similar_jobs(user_input, job_data_path, top_n=5):
    user_embedding = get_embedding(user_input)

    with open(job_data_path, 'r') as f:
        jobs = json.load(f)

    scored = []
    for job in jobs:
        score = cosine_similarity(user_embedding, job["embedding"])
        scored.append((score, job))

    scored.sort(reverse=True, key=lambda x: x[0])
    return [job for _, job in scored[:top_n]]
