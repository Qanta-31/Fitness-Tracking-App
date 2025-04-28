import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRecordClick = () => {
    navigate('/record-activity'); // Navigate to record-activity page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">
          Track Your Progress with <span className="text-orange-500">FitSync</span>
        </h1>

        <button
          onClick={handleRecordClick}
          className="bg-orange-500 text-white rounded-full px-8 py-4 text-lg font-bold shadow-md hover:bg-orange-600 transition"
        >
          Record
        </button>
      </main>
    </div>
  );
};

export default HomePage;
