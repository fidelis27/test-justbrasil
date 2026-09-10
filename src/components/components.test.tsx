import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocumentDetails } from './DocumentDetails';
import { SearchForm } from './SearchForm';
import { SearchResultCard } from './SearchResultCard';
import { SearchState } from './SearchState';
import type { DocumentDetails as DocumentDetailsType } from '../types/document';

const document: DocumentDetailsType = {
  id: '123',
  title: 'Processo de indenização por danos materiais',
  type: 'Processo',
  date: '2026-08-20',
  description: 'Ação relacionada a pedido de reparação.',
  processNumber: '0000000-00.2026.8.26.0000',
  parties: ['Marina Alves', 'Seguradora Horizonte S.A.'],
  court: 'Tribunal de Justiça de São Paulo',
  status: 'Em andamento',
  summary: 'Resumo do documento jurídico.',
};

describe('SearchForm', () => {
  it('submits the current query and clears it on request', () => {
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    render(<SearchForm value="processo" isLoading={false} onChange={onChange} onSubmit={onSubmit} />);

    fireEvent.submit(screen.getByRole('form'));
    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('disables the search action while loading', () => {
    render(<SearchForm value="processo" isLoading onChange={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Buscando...' })).toBeDisabled();
  });
});

describe('SearchState', () => {
  it.each([
    ['idle', 'Comece uma pesquisa'],
    ['loading', 'Buscando informações'],
    ['empty', 'Nenhum resultado encontrado'],
    ['error', 'Não foi possível concluir a busca'],
  ] as const)('renders the %s state', (kind, message) => {
    render(<SearchState kind={kind} query="processo" onRetry={vi.fn()} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});

describe('SearchResultCard', () => {
  it('shows the process label and links to the document', () => {
    render(<MemoryRouter><SearchResultCard result={document} /></MemoryRouter>);

    expect(screen.getByText('Processo', { selector: '.process-label' })).toBeInTheDocument();
    expect(screen.getByText(document.processNumber)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/documento/123');
  });
});

describe('DocumentDetails', () => {
  it('renders all additional document fields', () => {
    render(<DocumentDetails document={document} />);

    expect(screen.getByRole('heading', { name: document.title })).toBeInTheDocument();
    expect(screen.getByText(document.processNumber)).toBeInTheDocument();
    expect(screen.getByText(document.court)).toBeInTheDocument();
    expect(screen.getByText('Marina Alves x Seguradora Horizonte S.A.')).toBeInTheDocument();
    expect(screen.getByText(document.summary)).toBeInTheDocument();
  });
});