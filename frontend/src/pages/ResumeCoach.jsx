import React, { useState } from 'react';

const ResumeCoach = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile && !question.trim()) return;

    const formData = new FormData();
    if (resumeFile) formData.append('file', resumeFile);
    if (question.trim()) formData.append('question', question);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnswer(data.answer || 'No response from AI.');
    } catch (err) {
      console.error('Submission failed:', err);
      setAnswer('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">AI Resume & Career Goal Analyzer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Career Goal (optional)</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder="e.g. I want to become a machine learning engineer"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {answer && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold text-gray-800">AI Coach Response:</h3>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeCoach;