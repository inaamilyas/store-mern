const WalkInLogViewer = ({ walkInLogs }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        Walk-In Logs
      </h3>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-700">
          Manage Store Managers
        </h3>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add New Manager
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Store Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Timestamp
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {walkInLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-3 px-4 text-gray-800">{log.storeId.name}</td>
                <td className="py-3 px-4 text-gray-800">{log.timestamp}</td>
                <td className="py-3 px-4 text-gray-800">
                  {log.estimatedCustomerCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {walkInLogs.length === 0 && (
        <p className="text-gray-600 mt-4">No walk-in logs available.</p>
      )}
    </div>
  );
};

export default WalkInLogViewer;
