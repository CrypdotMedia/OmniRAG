import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from 'stream';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "document-uploads";

  if (!connectionString) {
    context.res = {
      status: 500,
      body: "Storage connection string is not configured."
    };
    return;
  }

  if (!req.body || !req.body.file) {
    context.res = {
      status: 400,
      body: "Please provide a file in the request body."
    };
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();

    const blobName = `${new Date().getTime()}-${req.body.filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const stream = new Readable();
    stream.push(req.body.file);
    stream.push(null);

    await blockBlobClient.uploadStream(stream);

    context.res = {
      status: 200,
      body: { message: "File uploaded successfully", blobName: blobName }
    };
  } catch (error) {
    context.log.error("Error uploading file:", error);
    context.res = {
      status: 500,
      body: `Error uploading file: ${error.message}`
    };
  }
};

export default httpTrigger;