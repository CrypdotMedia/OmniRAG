import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { CosmosClient } from "@azure/cosmos";

export const searchEmbeddings = async (req, res) => {
  const openaiEndpoint = process.env.OPENAI_ENDPOINT;
  const openaiKey = process.env.OPENAI_KEY;
  const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
  const cosmosKey = process.env.COSMOS_KEY;

  if (!openaiEndpoint || !openaiKey || !cosmosEndpoint || !cosmosKey) {
    return res.status(500).json({ error: "Missing required environment variables" });
  }

  const openaiClient = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiKey));
  const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });

  const query = req.query.query || req.body?.query;
  if (!query) {
    return res.status(400).json({ error: "Please provide a search query" });
  }

  try {
    // Generate embedding for the search query
    const result = await openaiClient.getEmbeddings("text-embedding-ada-002", [query]);
    const queryEmbedding = result.data[0].embedding;

    // Search for similar embeddings in Cosmos DB
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

    res.status(200).json({ results: resources.map(item => item.content) });
  } catch (error) {
    res.status(500).json({ error: `Error searching embeddings: ${error.message}` });
  }
};