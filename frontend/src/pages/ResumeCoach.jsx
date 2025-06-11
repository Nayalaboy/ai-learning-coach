import { useState, useEffect } from 'react';
import axios from 'axios';
import LinkList from '../LinkList';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="min-h-screen">
      {/* Hero section with animated background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-purple-50/10 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA4YzAgMi0yIDQtNCA0cy00LTItNC00IDItNCA0LTQgNCAyIDQgNHoiIGZpbGw9IiNlZWUiLz48L2c+PC9zdmc+')] 
        bg-[length:5px_5px] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Build Your Personal AI Career Roadmap
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload your resume, set your career goal, and let our AI create a personalized roadmap to success.
            </p>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Resume upload */}
              <div className="space-y-0.5">
                <label className="block text-lg font-medium text-gray-700">
                  📄 Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors group">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox=" 0 0 100 ">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept=".pdf" required onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Career Goal */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  🎯 Career Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Cloud engineer"
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>

              {/* Question */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  💬 Specific Question?
                </label>
                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Optional: Ask any specific questions about your career path..."
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>

              {/* Model picker */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  🤖 AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Roadmap
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Roadmap section */}
      {steps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Your Personalized Career Roadmap</h2>
            <p className="mt-4 text-xl text-gray-600">Follow these steps to achieve your career goals</p>
          </div>
          <div className="grid gap-8">
            {steps.map((step, idx) => {
              const urls = step.links?.length ? step.links : extractUrls(step.description);
              let desc = step.description;
              urls.forEach((u) => (desc = desc.replace(u, '')));
              desc = desc.trim();

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                        <span className="text-xl font-bold">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                      <p className="mt-2 text-gray-600">{desc}</p>
                      {urls.length > 0 && (
                        <div className="mt-4">
                          <LinkList links={urls} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}