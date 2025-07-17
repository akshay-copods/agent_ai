import ChatBot from './components/chat/ChatBot';
// import { main } from './server';

function App() {
  const awakeMonster = () => {
    // main();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Your App Title
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Main Content Area</h2>
          <p className="text-gray-600">
            Your application content goes here. The AI chat assistant will be
            accessible from any page.
          </p>
          <p className="text-gray-600 mt-4">
            Try clicking the chat button in the bottom right corner!
          </p>
          <button onClick={awakeMonster}>Click to awakt agen</button>
        </div>
      </main>

      {/* Chat Bot Component */}
      <ChatBot />
    </div>
  );
}

export default App;
