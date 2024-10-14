import { Store, sym, lit } from 'rdflib';
import { insertSourceData } from './cosmosClient';

export function generateRDFTriples(data: any) {
  const store = new Store();
  const baseURI = 'http://example.com/';

  // This is a simplified example. You'll need to implement more complex logic
  // based on your data structure and ontology.
  Object.entries(data).forEach(([key, value]) => {
    const subject = sym(`${baseURI}${data.id || 'resource'}`);
    const predicate = sym(`${baseURI}${key}`);
    const object = typeof value === 'string' ? lit(value) : sym(`${baseURI}${value}`);
    store.add(subject, predicate, object);
  });

  return store.statements;
}

export async function processAndStoreRDFTriples(data: any) {
  const triples = generateRDFTriples(data);
  const triplesForStorage = triples.map(triple => ({
    subject: triple.subject.value,
    predicate: triple.predicate.value,
    object: triple.object.value,
    type: 'RDFTriple'
  }));

  for (const triple of triplesForStorage) {
    await insertSourceData(triple);
  }

  return triplesForStorage;
}