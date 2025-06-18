function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}

function LinkList({ links }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200"
        >
          <span className="truncate max-w-[200px]">{getHostname(link)}</span>
          <svg
            className="ml-1.5 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default LinkList; 