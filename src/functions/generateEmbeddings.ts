import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const openaiEndpoint = process.env.OPENAI_ENDPOINT;
  const openaiKey = process.env.OPENAI_KEY;
  const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
  const cosmosKey = process.env.COSMOS_KEY;
  const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!openaiEndpoint || !openaiKey || !cosmosEndpoint || !cosmosKey || !storageConnectionString) {
    context.res = {
      status: 500,
      body: "Missing required environment variables"
    };
    return;
  }

  const openaiClient = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiKey));
  const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
  const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);

  try {
    const containerClient = blobServiceClient.getContainerClient("document-uploads");
    const blobClient = containerClient.getBlobClient(req.body.blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    const blobContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);

    const result = await openaiClient.getEmbeddings("text-embedding-ada-002", [blobContent]);
    const embedding = result.data[0].embedding;

    const database = cosmosClient.database("omnirag");
    const container = database.container("embeddings");
    await container.items.create({
      id: req.body.blobName,
      embedding: embedding,
      content: blobContent
    });

    context.res = {
      status: 200,
      body: { message: `Embeddings generated and stored for blob: ${req.body.blobName}` }
    };
  } catch (error) {
    context.log.error(`Error processing blob: ${error.message}`);
    context.res = {
      status: 500,
      body: `Error processing blob: ${error.message}`
    };
  }
};

async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

export default httpTrigger;