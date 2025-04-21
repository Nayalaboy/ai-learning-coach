// frontend/src/ResumeCoach.jsx

import { useState } from 'react';
import axios from 'axios';

export default function ResumeCoach() {
  const [file, setFile] = useState(null);
  const [goal, setGoal] = useState('');
  const [question, setQuestion] = useState('');
  const [model, setModel] = useState("gpt-4o");
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer('');
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("goal", goal);
    formData.append("question", question);
    formData.append("model", model);

    try {
      const res = await axios.post(`${API_URL}/smart-coach`, formData);
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("❌ " + (err.response?.data?.detail || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          AI Career & Learning Coach
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">📄 Upload Your Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🎯 Your Career Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a cloud engineer"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">💬 Any Specific Question?</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g., What skills am I missing based on my resume?"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🤖 Choose AI Model</label>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => setModel(e.target.value)}
              value={model}
            >
              <option value="gpt-3.5-turbo">
                GPT-3.5 Turbo – Fast, affordable
              </option>
              <option value="gpt-4">
                GPT-4 – Best for deep reasoning
              </option>
              <option value="gpt-4o">
                GPT-4o – Great for multilingual/resume analysis
              </option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              💡 GPT-4o is recommended for mixed French/English resumes
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
          >
            {loading ? "⏳ Analyzing..." : "🚀 Get My Roadmap"}
          </button>
        </form>

        {answer && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
            <h2 className="font-bold text-lg mb-2 text-blue-800">✨ Personalized AI Feedback:</h2>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
