import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '';
const key = import.meta.env.VITE_AZURE_OPENAI_KEY || '';

const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));

// ... rest of the file remains the same