import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import GraphPage from './pages/GraphPage';
import EmbeddingsPage from './pages/EmbeddingsPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/embeddings" element={<EmbeddingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;