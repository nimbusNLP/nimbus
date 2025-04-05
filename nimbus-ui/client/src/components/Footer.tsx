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
