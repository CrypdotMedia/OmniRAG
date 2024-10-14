import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const openaiEndpoint = process.env.OPENAI_ENDPOINT;
  const openaiKey = process.env.OPENAI_KEY;
  const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
  const cosmosKey = process.env.COSMOS_KEY;

  if (!openaiEndpoint || !openaiKey || !cosmosEndpoint || !cosmosKey) {
    context.res = {
      status: 500,
      body: "Missing required environment variables"
    };
    return;
  }

  const openaiClient = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiKey));
  const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });

  const query = req.query.query || req.body?.query;
  if (!query) {
    context.res = {
      status: 400,
      body: "Please provide a search query"
    };
    return;
  }

  try {
    const result = await openaiClient.getEmbeddings("text-embedding-ada-002", [query]);
    const queryEmbedding = result.data[0].embedding;

    const database = cosmosClient.database("omnirag");
    const container = database.container("embeddings");
    const querySpec = {
      query: "SELECT TOP 5 c.id, c.content FROM c ORDER BY udf.cosineSimilarity(c.embedding, @queryEmbedding) DESC",
      parameters: [
        {
          name: "@queryEmbedding",
          value: queryEmbedding
        }
      ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: { results: resources.map(item => item.content) }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error searching embeddings: ${error.message}`
    };
  }
};

export default httpTrigger;