import { useState } from 'react';

export default function Results() {
  const [tab, setTab] = useState('map');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Results</h2>

      {/* Tabs */}
      <div className="flex space-x-4 justify-center mb-6">
        <button
          onClick={() => setTab('map')}
          className={`px-4 py-2 rounded ${tab === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Well Map
        </button>
        <button
          onClick={() => setTab('gradient')}
          className={`px-4 py-2 rounded ${tab === 'gradient' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Reservoir Gradient
        </button>
        <button
          onClick={() => setTab('frac')}
          className={`px-4 py-2 rounded ${tab === 'frac' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Frac Recipe
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'map' && (
        <div className="border p-6 rounded-xl shadow bg-gray-50 text-center">
          <p className="text-gray-700">[Placeholder for interactive Well / Lease Map]</p>
        </div>
      )}

      {tab === 'gradient' && (
        <div className="border p-6 rounded-xl shadow bg-gray-50 text-center">
          <p className="text-gray-700">[Placeholder for Reservoir Gradient Chart]</p>
        </div>
      )}

      {tab === 'frac' && (
        <div className="border p-6 rounded-xl shadow bg-gray-50 text-center">
          <p className="text-gray-700">Recommended Frac Recipe:</p>
          <ul className="mt-4 list-disc list-inside text-left text-gray-800">
            <li>Fluid: Slickwater + Friction Reducer</li>
            <li>Proppant: 100 Mesh + 40/70 Mix</li>
            <li>Rate: 90 bpm</li>
            <li>Stages: 24</li>
          </ul>
        </div>
      )}

      {/* Export Button */}
      <div className="text-center mt-8">
        <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
          Export Results
        </button>
      </div>
    </div>
  );
}
