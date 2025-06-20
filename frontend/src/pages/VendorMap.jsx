export default function VendorMap() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-4">Third-Party Data Vendors</h2>
        <p className="text-gray-600 mb-6">
          Here’s a placeholder map and list of datasets you could purchase.
        </p>
  
        <div className="w-full max-w-2xl border rounded-lg p-4 bg-gray-50 shadow">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Well logs for selected basin</li>
            <li>Production history for offset wells</li>
            <li>Geological tops dataset</li>
            <li>Fracture gradient models</li>
          </ul>
        </div>
  
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => alert('Continuing to Dashboard...')}
        >
          Next
        </button>
      </div>
    );
  }
  