import { documents } from './documents';
import type { DocumentDetails, SearchResult } from '../types/document';

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  await wait(600);
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');

  if (normalizedQuery === 'erro') {
    throw new Error('Falha simulada na busca.');
  }

  if (normalizedQuery === 'vazio') {
    return [];
  }

  return documents
    .filter((document) => {
      const searchableText = [document.title, document.description, document.type, ...document.parties]
        .join(' ')
        .toLocaleLowerCase('pt-BR');
      return searchableText.includes(normalizedQuery) || ['processo', 'indenização', 'ana'].includes(normalizedQuery);
    })
    .slice(0, 10)
    .map(({ id, title, type, date, description }) => ({ id, title, type, date, description }));
}

export async function getDocumentById(id: string): Promise<DocumentDetails> {
  await wait(600);

  if (id === '999') {
    throw new Error('Falha simulada nos detalhes.');
  }

  const document = documents.find((item) => item.id === id);
  if (!document) {
    throw new Error('NOT_FOUND');
  }

  return document;
}