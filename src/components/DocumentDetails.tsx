import type { DocumentDetails as DocumentDetailsType } from '../types/document';
import type { Ref } from 'react';

type DocumentDetailsProps = { document: DocumentDetailsType; titleRef?: Ref<HTMLHeadingElement> };

export function DocumentDetails({ document, titleRef }: DocumentDetailsProps) {
  return <>
    <div className="detail-heading"><div><span className="eyebrow">{document.type}</span><h1 ref={titleRef}>{document.title}</h1></div><span className="status-badge">{document.status}</span></div>
    <p className="detail-description">{document.description}</p>
    <dl className="detail-grid">
      <div><dt>Número do processo</dt><dd className="breakable">{document.processNumber}</dd></div>
      <div><dt>Tribunal</dt><dd>{document.court}</dd></div>
      <div><dt>Partes</dt><dd>{document.parties.join(' x ')}</dd></div>
      <div><dt>Data</dt><dd>{new Intl.DateTimeFormat('pt-BR').format(new Date(`${document.date}T12:00:00`))}</dd></div>
    </dl>
    <section className="summary-section"><span className="eyebrow">Resumo</span><p>{document.summary}</p></section>
  </>;
}