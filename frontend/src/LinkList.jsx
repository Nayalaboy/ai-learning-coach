import React from 'react';

function LinkList({ links }) {
  const getHostname = (url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.split('.')[0];
    } catch {
      return 'link';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {getHostname(link)}
        </a>
      ))}
    </div>
  );
}

export default LinkList;