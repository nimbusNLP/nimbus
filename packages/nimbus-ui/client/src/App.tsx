import Header from "./components/Header";
import Footer from "./components/Footer";
import SandBox from "./components/Sandbox";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <SandBox />
      </main>
      <Footer />
    </div>
  );
}

export default App;
