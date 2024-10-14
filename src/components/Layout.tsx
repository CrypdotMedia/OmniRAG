import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Network, FileText, MessageSquare } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">OmniRAG</h1>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/graph" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Network size={20} />
              <span>Graph</span>
            </Link>
          </li>
          <li>
            <Link to="/embeddings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <FileText size={20} />
              <span>Embeddings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;