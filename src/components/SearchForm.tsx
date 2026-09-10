type SearchFormProps = {
  value: string;
  isLoading: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchForm({ value, isLoading, error, onChange, onSubmit }: SearchFormProps) {
  return (
    <form className="search-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <label htmlFor="search-query">Pesquise por nome, processo ou palavra-chave</label>
      <div className="search-row">
        <div className="input-wrap">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="search-query"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Ex.: indenização, Ana ou processo"
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'search-error' : 'search-help'}
          />
          {value && <button className="clear-button" type="button" onClick={() => onChange('')} aria-label="Limpar busca">×</button>}
        </div>
        <button className="primary-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      {error ? <p className="field-error" id="search-error" role="alert">{error}</p> : <p className="search-help" id="search-help">Tente uma busca como “processo” ou “indenização”.</p>}
    </form>
  );
}