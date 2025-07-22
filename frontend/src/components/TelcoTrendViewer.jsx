

const TelcoTrendViewer = ({ telcoTrends }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Telco Trends</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trend</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {telcoTrends.map((trend) => (
              <tr key={trend.id} className="border-b border-gray-200 last:border-b-0">
                <td className="py-3 px-4 text-gray-800">{trend.category}</td>
                <td className="py-3 px-4 text-gray-800">{trend.trend}</td>
                <td className="py-3 px-4 text-gray-800">{trend.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {telcoTrends.length === 0 && <p className="text-gray-600 mt-4">No telco trends available.</p>}
    </div>
  );
};

export default TelcoTrendViewer