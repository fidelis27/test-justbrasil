type SearchStateProps = {
  kind: 'idle' | 'loading' | 'empty' | 'error';
  query?: string;
  onRetry?: () => void;
};

export function SearchState({ kind, query, onRetry }: SearchStateProps) {
  if (kind === 'loading') {
    return <div className="state-panel loading-panel" role="status"><span className="spinner" aria-hidden="true" /><div><strong>Buscando informações</strong><p>Estamos consultando os documentos jurídicos.</p></div></div>;
  }
  if (kind === 'idle') {
    return <div className="state-panel intro-panel"><span className="state-mark" aria-hidden="true">↗</span><div><strong>Comece uma pesquisa</strong><p>Encontre processos, decisões e documentos em poucos segundos.</p></div></div>;
  }
  if (kind === 'empty') {
    return <div className="state-panel" role="status" aria-live="polite"><span className="state-mark muted-mark" aria-hidden="true">?</span><div><strong>Nenhum resultado encontrado</strong><p>Não encontramos documentos para “{query}”. Tente uma grafia diferente ou termos mais amplos.</p></div></div>;
  }
  return <div className="state-panel error-panel" role="alert" aria-live="assertive"><span className="state-mark error-mark" aria-hidden="true">!</span><div><strong>Não foi possível concluir a busca</strong><p>Ocorreu uma instabilidade. Sua consulta foi preservada.</p><button className="text-button" type="button" onClick={onRetry}>Tentar novamente <span aria-hidden="true">→</span></button></div></div>;
}