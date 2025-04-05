import githubIcon from "../assets/github.svg";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 border-b border-gray-800 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-indigo-500 rounded mr-2 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-xl font-semibold">Nimbus Playground</h1>
      </div>
      <a
        href="https://github.com/nimbusNLP"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-gray-800 rounded px-3 py-1.5 text-sm hover:bg-gray-700 transition-colors"
      >
        <img src={githubIcon} alt="GitHub" className="h-4 w-4 mr-1.5" />
        GitHub
      </a>
    </header>
  );
};

export default Header;
