import express from 'express';
import { uploadFile } from './uploadFile.js';
import { generateEmbeddings } from './generateEmbeddings.js';
import { searchEmbeddings } from './searchEmbeddings.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/uploadFile', uploadFile);
app.post('/api/generateEmbeddings', generateEmbeddings);
app.get('/api/searchEmbeddings', searchEmbeddings);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});