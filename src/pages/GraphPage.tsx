import React, { useState } from 'react';
import { Search } from 'lucide-react';
import GraphVisualizer from '../components/GraphVisualizer';

const GraphPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [graphData, setGraphData] = useState(null);

  const handleSearch = () => {
    // TODO: Implement SPARQL query execution and graph data retrieval
    // For now, we'll use dummy data
    setGraphData({
      nodes: [
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' },
      ],
      links: [
        { source: 1, target: 2 },
        { source: 2, target: 3 },
      ],
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Graph Query</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="Enter SPARQL query..."
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-r-lg">
          <Search size={20} />
        </button>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-4">
        {graphData ? (
          <GraphVisualizer data={graphData} />
        ) : (
          <p className="text-center text-gray-500">No graph data to display</p>
        )}
      </div>
    </div>
  );
};

export default GraphPage;