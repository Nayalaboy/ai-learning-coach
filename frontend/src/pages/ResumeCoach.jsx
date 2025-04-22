import { useState } from 'react';
import axios from 'axios';
import LinkList from '../LinkList';      // one level up from /pages

/* Extract http(s)://… or www.… chunks and split glued hostnames */
function extractUrls(text = '') {
  const raw = text.match(/https?:\/\/[^\s"]+|www\.[^\s"]+/g) || [];
  const urls = [];

  raw.forEach((chunk) => {
    chunk
      .split(/(?=https?:\/\/)|(?=www\.)/)
      .filter(Boolean)
      .forEach((u) => urls.push(u));
  });

  return urls;
}

export default function ResumeCoach() {
  const [file, setFile] = useState(null);
  const [goal, setGoal] = useState('');
  const [question, setQuestion] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSteps([]);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('goal', goal);
    formData.append('question', question);
    formData.append('model', model);

    try {
      const { data } = await axios.post(`${API_URL}/smart-coach`, formData);
      setSteps(data.steps);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          AI Career &amp; Learning Coach
        </h1>

        {/* ──────── form ──────── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">📄 Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🎯 Career Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a cloud engineer"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">💬 Specific Question?</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g., What skills am I missing?"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🤖 AI Model</label>
            <select
              className="w-full border p-2 rounded"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gpt-3.5-turbo">GPT‑3.5 Turbo</option>
              <option value="gpt-4">GPT‑4</option>
              <option value="gpt-4o">GPT‑4o</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? '⏳ Generating…' : '🚀 Get Roadmap'}
          </button>
        </form>

        {/* ──────── roadmap cards ──────── */}
        {steps.length > 0 && (
          <div className="grid gap-6 mt-8">
            {steps.map((step, idx) => {
              /* Fallback: extract URLs if backend didn’t give an array */
              const urls = step.links?.length ? step.links : extractUrls(step.description);

              /* Strip URLs from description for clean text */
              let desc = step.description;
              urls.forEach((u) => { desc = desc.replace(u, ''); });
              desc = desc.trim();

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{desc}</p>
                  {urls.length > 0 && <LinkList links={urls} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
