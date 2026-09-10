import { describe, expect, it } from 'vitest';
import { getDocumentById, searchDocuments } from './mockApi';

describe('searchDocuments', () => {
  it('returns matching documents for a valid query', async () => {
    const results = await searchDocuments(' processo ');

    expect(results).toHaveLength(3);
    expect(results[0]).toMatchObject({
      id: '123',
      title: 'Processo de indenização por danos materiais',
      type: 'Processo',
    });
    expect(results[0]).not.toHaveProperty('processNumber');
  });

  it('matches queries without case sensitivity', async () => {
    const results = await searchDocuments('INDENIZAÇÃO');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('123');
  });

  it('returns an empty list for the empty-result scenario', async () => {
    await expect(searchDocuments('vazio')).resolves.toEqual([]);
  });

  it('rejects for the simulated search failure', async () => {
    await expect(searchDocuments('erro')).rejects.toThrow('Falha simulada na busca.');
  });
});

describe('getDocumentById', () => {
  it('returns complete details for an existing document', async () => {
    const document = await getDocumentById('123');

    expect(document).toMatchObject({
      id: '123',
      court: 'Tribunal de Justiça de São Paulo',
      status: 'Em andamento',
    });
    expect(document.parties).toEqual(['Marina Alves', 'Seguradora Horizonte S.A.']);
    expect(document.summary).toBeTruthy();
  });

  it('rejects the simulated detail failure', async () => {
    await expect(getDocumentById('999')).rejects.toThrow('Falha simulada nos detalhes.');
  });

  it('rejects with a not-found error for an unknown id', async () => {
    await expect(getDocumentById('unknown')).rejects.toThrow('NOT_FOUND');
  });
});