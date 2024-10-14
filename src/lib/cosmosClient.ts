import { CosmosClient } from '@azure/cosmos';

const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT || '';
const key = import.meta.env.VITE_COSMOS_KEY || '';
const client = new CosmosClient({ endpoint, key });

// ... rest of the file remains the same