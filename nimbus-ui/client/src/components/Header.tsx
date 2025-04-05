const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 border-b border-gray-800 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-indigo-500 rounded mr-2 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-xl font-semibold">Nimbus Playground</h1>
      </div>
      <button className="flex items-center bg-gray-800 rounded px-3 py-1.5 text-sm hover:bg-gray-700 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Account
      </button>
    </header>
  );
};

export default Header;
