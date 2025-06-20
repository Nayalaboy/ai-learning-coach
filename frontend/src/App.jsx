import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResumeCoach from './pages/ResumeCoach';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navigation */}
        <nav className="fixed w-full bg-white shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-gray-900">
                  AI Learning Coach
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Try It Free
                </button>
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg">
              <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Home
              </Link>
              <Link to="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                About
              </Link>
              <Link to="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Contact
              </Link>
              <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Try It Free
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<ResumeCoach />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/features" className="text-gray-500 hover:text-gray-900">Feature(I am workign on it, not ready yet)</Link></li>
                  <li><Link to="/pricing" className="text-gray-500 hover:text-gray-900">Pricing(I am workign on it, not ready yet)</Link></li>
                  <li><Link to="/roadmap" className="text-gray-500 hover:text-gray-900">Roadmap(I am workign on it, not ready yet)</Link></li>
                </ul>
              </div>
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link></li>
                  <li><Link to="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link></li>
                  <li><Link to="/careers" className="text-gray-500 hover:text-gray-900">Careers</Link></li>
                </ul>
              </div> */}
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy</Link></li>
                  <li><Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms</Link></li>
                  <li><Link to="/security" className="text-gray-500 hover:text-gray-900">Security</Link></li>
                </ul>
              </div> */}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} AI Learning Coach. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
