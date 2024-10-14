import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from 'stream';

export const uploadFile = async (req, res) => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "document-uploads";

  if (!connectionString) {
    return res.status(500).json({ error: "Storage connection string is not configured." });
  }

  if (!req.body || !req.body.file) {
    return res.status(400).json({ error: "Please provide a file in the request body." });
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists();

    const blobName = `${new Date().getTime()}-${req.body.filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Convert the file buffer to a readable stream
    const stream = new Readable();
    stream.push(req.body.file);
    stream.push(null);

    // Upload the file content
    await blockBlobClient.uploadStream(stream);

    res.status(200).json({ message: "File uploaded successfully", blobName: blobName });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: `Error uploading file: ${error.message}` });
  }
};