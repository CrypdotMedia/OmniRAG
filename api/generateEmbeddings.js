import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";

export const generateEmbeddings = async (req, res) => {
  const openaiEndpoint = process.env.OPENAI_ENDPOINT;
  const openaiKey = process.env.OPENAI_KEY;
  const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
  const cosmosKey = process.env.COSMOS_KEY;
  const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!openaiEndpoint || !openaiKey || !cosmosEndpoint || !cosmosKey || !storageConnectionString) {
    return res.status(500).json({ error: "Missing required environment variables" });
  }

  const openaiClient = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiKey));
  const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
  const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);

  try {
    // Read the blob content
    const containerClient = blobServiceClient.getContainerClient("document-uploads");
    const blobClient = containerClient.getBlobClient(req.body.blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    const blobContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);

    // Generate embeddings
    const result = await openaiClient.getEmbeddings("text-embedding-ada-002", [blobContent]);
    const embedding = result.data[0].embedding;

    // Store in Cosmos DB
    const database = cosmosClient.database("omnirag");
    const container = database.container("embeddings");
    await container.items.create({
      id: req.body.blobName,
      embedding: embedding,
      content: blobContent
    });

    res.status(200).json({ message: `Embeddings generated and stored for blob: ${req.body.blobName}` });
  } catch (error) {
    console.error(`Error processing blob: ${error.message}`);
    res.status(500).json({ error: `Error processing blob: ${error.message}` });
  }
};

async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}