export const API_BASE_URL = import.meta.env.VITE_AZURE_FUNCTION_APP_URL || '';

export const API_ENDPOINTS = {
  UPLOAD_FILE: `${API_BASE_URL}/api/uploadFile`,
  SEARCH_EMBEDDINGS: `${API_BASE_URL}/api/searchEmbeddings`,
};