import { useState } from 'react';
import axios from 'axios';

export default function ResumeCoach() {
  const [file, setFile] = useState(null);
  const [goal, setGoal] = useState('');
  const [question, setQuestion] = useState('');
  const [model, setModel] = useState('gpt-4o'); 
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer('');
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (goal) formData.append("goal", goal);
    if (question) formData.append("question", question);
    if (model) formData.append("model", model); 

    try {
      const res = await axios.post("http://localhost:8000/smart-coach", formData);
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">AI Learning Coach</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-semibold">Upload Your Resume (PDF):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />

        <label className="font-semibold">Select AI Model:</label>
        <select
          className="border p-2 rounded"
          onChange={(e) => setModel(e.target.value)}
          value={model}
        >
          <option value="gpt-3.5-turbo">
            GPT-3.5 Turbo – Fast, affordable, good for basic feedback
          </option>
          <option value="gpt-4">
            GPT-4 – More accurate and thoughtful, ideal for learning plans
          </option>
          <option value="gpt-4o">
            GPT-4o – Best for speed, intelligence, and multilingual support
          </option>
        </select>

        <label className="font-semibold">Your Career Goal:</label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Become a cloud engineer"
          className="border p-2 rounded"
        />

        <label className="font-semibold">Any Specific Question?</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g., What skills am I missing based on my resume?"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Get AI Advice"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          <h2 className="font-bold mb-2">AI Feedback:</h2>
          {answer}
        </div>
      )}
    </div>
  );
}
