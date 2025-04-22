import { useState } from 'react';

export default function LinkList({ links }) {
  const [expanded, setExpanded] = useState(false);

  const first  = links[0];
  const others = links.slice(1);
  const pretty = (url) => url.replace(/^https?:\/\//, '');

  return (
    <div className="space-y-2">
      {/* first link (always visible) */}
      <a
        href={first.startsWith('http') ? first : `https://${first}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
      >
        {pretty(first)}
      </a>

      {/* toggle immediately under the first link */}
      {others.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          {expanded ? 'Show less' : `+${others.length} more`}
        </button>
      )}

      {/* remaining links appear under the toggle when expanded */}
      {expanded &&
        others.map((url, idx) => (
          <a
            key={idx}
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
          >
            {pretty(url)}
          </a>
        ))}
    </div>
  );
}
