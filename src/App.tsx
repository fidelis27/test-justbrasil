import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DocumentDetails } from './components/DocumentDetails';
import { SearchForm } from './components/SearchForm';
import { SearchResultCard } from './components/SearchResultCard';
import { SearchState } from './components/SearchState';
import { getDocumentById, searchDocuments } from './data/mockApi';
import type { DocumentDetails as DocumentDetailsType, SearchResult } from './types/document';

function Brand() {
  return <Link className="brand" to="/"><span className="brand-mark">J</span><span>jusbrasil</span></Link>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><Brand /><span className="header-context">Pesquisa jurídica</span></div></header>{children}<footer className="site-footer"><span>Jusbrasil</span><span>Informação jurídica para decisões melhores</span></footer></div>;
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle');
  const [error, setError] = useState('');
  const initialQuery = useRef(searchParams.get('q') ?? '');

  const performSearch = async (value = query) => {
    const normalizedQuery = value.trim();
    if (normalizedQuery.length < 2) {
      setError('Digite pelo menos 2 caracteres para pesquisar.');
      return;
    }
    setError('');
    setSubmittedQuery(normalizedQuery);
    setSearchParams({ q: normalizedQuery });
    setStatus('loading');
    try {
      const nextResults = await searchDocuments(normalizedQuery);
      setResults(nextResults);
      setStatus(nextResults.length ? 'success' : 'empty');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (initialQuery.current) {
      void performSearch(initialQuery.current);
      initialQuery.current = '';
    }
  }, []);

  return <Shell>
    <main className="main-content search-page">
      <section className="search-hero" aria-labelledby="page-title">
        <div className="hero-copy"><span className="eyebrow">Pesquisa jurídica</span><h1 id="page-title">Encontre a informação que move seu caso.</h1><p>Pesquise processos, decisões e documentos jurídicos em uma experiência feita para ser clara.</p></div>
        <div className="hero-note"><span className="note-line" /><span>Busca simples.<br />Contexto completo.</span></div>
      </section>
      <section className="search-section" aria-label="Busca de documentos">
        <SearchForm value={query} isLoading={status === 'loading'} error={error} onChange={(value) => { setQuery(value); if (error) setError(''); }} onSubmit={() => void performSearch()} />
        {status === 'success' && <div className="results-heading"><div><span className="eyebrow">Resultados encontrados</span><h2>Documentos sobre “{submittedQuery}”</h2></div><span className="result-count">{results.length} {results.length === 1 ? 'resultado' : 'resultados'}</span></div>}
        {status === 'success' ? <div className="results-list">{results.map((result) => <SearchResultCard key={result.id} result={result} />)}</div> : <SearchState kind={status === 'error' ? 'error' : status} query={submittedQuery} onRetry={() => void performSearch(submittedQuery)} />}
      </section>
    </main>
  </Shell>;
}

function DocumentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [document, setDocument] = useState<DocumentDetailsType | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'not-found' | 'error'>('loading');
  const titleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    void getDocumentById(id ?? '').then((value) => {
      if (active) { setDocument(value); setStatus('success'); }
    }).catch((reason: Error) => {
      if (active) setStatus(reason.message === 'NOT_FOUND' ? 'not-found' : 'error');
    });
    return () => { active = false; };
  }, [id]);

  useEffect(() => { if (status === 'success' || status === 'not-found' || status === 'error') titleRef.current?.focus(); }, [status]);

  const backToSearch = () => navigate(location.state?.from ?? '/');

  return <Shell><main className="main-content detail-page"><button className="back-button" type="button" onClick={backToSearch}><span aria-hidden="true">←</span> Voltar para resultados</button><div className="detail-surface" aria-live="polite">
    {status === 'loading' && <div className="detail-loading" role="status"><span className="spinner" aria-hidden="true" /><h1 tabIndex={-1} ref={(element) => { titleRef.current = element; }}>Carregando detalhes</h1><p>Estamos preparando as informações deste documento.</p></div>}
    {status === 'success' && document && <div ref={(element) => { titleRef.current = element; }} tabIndex={-1}><DocumentDetails document={document} /></div>}
    {status === 'not-found' && <div className="detail-message"><span className="state-mark muted-mark">?</span><h1 tabIndex={-1} ref={(element) => { titleRef.current = element; }}>Documento não encontrado</h1><p>Esse documento não está disponível nos dados da demonstração.</p><button className="primary-button compact-button" type="button" onClick={backToSearch}>Voltar para busca</button></div>}
    {status === 'error' && <div className="detail-message"><span className="state-mark error-mark">!</span><h1 tabIndex={-1} ref={(element) => { titleRef.current = element; }}>Detalhes indisponíveis</h1><p>Não foi possível carregar este documento agora.</p><button className="primary-button compact-button" type="button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}
  </div></main></Shell>;
}

export default function App() {
  return <Routes><Route path="/" element={<SearchPage />} /><Route path="/documento/:id" element={<DocumentPage />} /></Routes>;
}