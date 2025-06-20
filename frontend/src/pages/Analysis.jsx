import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Analysis() {
  const navigate = useNavigate();

  // Simulate a delay before showing results
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/results');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 mb-6"></div>
      <p className="text-xl text-gray-600">Analyzing your data…</p>
    </div>
  );
}
