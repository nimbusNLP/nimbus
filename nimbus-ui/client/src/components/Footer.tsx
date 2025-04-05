const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-gray-800 mt-auto">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {" "}
          2025 Nimbus Playground. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
