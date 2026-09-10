import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

function renderApp(initialEntry = '/') {
  return render(<MemoryRouter initialEntries={[initialEntry]}><App /></MemoryRouter>);
}

describe('application flows', () => {
  it('validates short searches without calling the data layer', () => {
    renderApp();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('pelo menos 2 caracteres');
  });

  it('hides previous results when a short search is submitted', async () => {
    renderApp('/?q=processo');
    expect(await screen.findByRole('heading', { name: 'Documentos sobre “processo”' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('pelo menos 2 caracteres');
    expect(screen.queryByRole('heading', { name: 'Documentos sobre “processo”' })).not.toBeInTheDocument();
    expect(screen.getByText('Comece uma pesquisa')).toBeInTheDocument();
  });

  it('restores a search from the query string and shows results', async () => {
    renderApp('/?q=processo');

    expect(await screen.findByRole('heading', { name: 'Documentos sobre “processo”' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Ver detalhes/ })).toHaveLength(3);
  });

  it('shows a document detail route', async () => {
    renderApp('/documento/123');

    expect(await screen.findByRole('heading', { name: 'Processo de indenização por danos materiais' })).toBeInTheDocument();
    expect(screen.getByText('Tribunal de Justiça de São Paulo')).toBeInTheDocument();
  });

  it('shows the not-found state for an unknown document', async () => {
    renderApp('/documento/unknown');

    expect(await screen.findByRole('heading', { name: 'Documento não encontrado' })).toBeInTheDocument();
  });

  it('shows the detail error state for the simulated failure', async () => {
    renderApp('/documento/999');

    expect(await screen.findByRole('heading', { name: 'Detalhes indisponíveis' })).toBeInTheDocument();
  });

  it('shows the empty and search error states', async () => {
    const { unmount } = renderApp('/?q=vazio');
    expect(await screen.findByText('Nenhum resultado encontrado')).toBeInTheDocument();
    unmount();

    renderApp('/?q=erro');
    await waitFor(() => expect(screen.getByText('Não foi possível concluir a busca')).toBeInTheDocument(), { timeout: 1500 });
  });
});