import { Link, useLocation } from 'react-router-dom';
import type { SearchResult } from '../types/document';

type SearchResultCardProps = { result: SearchResult };

export function SearchResultCard({ result }: SearchResultCardProps) {
  const location = useLocation();

  return (
    <Link className="result-card" to={`/documento/${result.id}`} state={{ from: `${location.pathname}${location.search}` }}>
      <div className="result-card-top"><span className="document-type">{result.type}</span><time dateTime={result.date}>{new Intl.DateTimeFormat('pt-BR').format(new Date(`${result.date}T12:00:00`))}</time></div>
      <h3>{result.title}</h3>
      {result.processNumber && <span className="process-number"><span className="process-label">Processo</span> {result.processNumber}</span>}
      <p>{result.description}</p>
      <span className="result-link">Ver detalhes <span aria-hidden="true">↗</span></span>
    </Link>
  );
}