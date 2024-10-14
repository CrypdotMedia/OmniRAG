import React, { useState, useCallback } from 'react';
import { Upload, Search } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

// Helper function for logging
const logError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  // TODO: Implement server-side logging here if needed
  // e.g., sendErrorToLoggingService(error, context);
};

const EmbeddingsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(''); // Clear any previous errors
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) {
      const errorMessage = 'Please select a file first.';
      setError(errorMessage);
      logError(new Error(errorMessage), 'File Upload - No File Selected');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadStatus('File uploaded and processed successfully!');
    } catch (error: any) {
      const errorMessage = `Error uploading file: ${error.message}. Please check your network connection and try again.`;
      setError(errorMessage);
      logError(error, 'File Upload');
      setUploadStatus('');
    } finally {
      setUploading(false);
      setFile(null);
    }
  }, [file]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      const errorMessage = 'Please enter a search query.';
      setError(errorMessage);
      logError(new Error(errorMessage), 'Embedding Search - Empty Query');
      return;
    }

    setError('');
    try {
      const response = await fetch(`${API_ENDPOINTS.SEARCH_EMBEDDINGS}?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results);
    } catch (error: any) {
      const errorMessage = `Error searching: ${error.message}. Please try again later.`;
      setError(errorMessage);
      logError(error, 'Embedding Search');
    }
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Embeddings</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Upload File</h3>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-blue-500 text-white p-2 rounded flex items-center disabled:opacity-50"
          >
            <Upload size={20} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Search Embeddings</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter search query..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <Search size={20} className="mr-2" />
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Search Results</h3>
          <ul className="list-disc pl-5">
            {results.map((result, index) => (
              <li key={index} className="mb-2">{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmbeddingsPage;