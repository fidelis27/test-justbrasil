export type SearchResult = {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  processNumber?: string;
};

export type DocumentDetails = SearchResult & {
  processNumber: string;
  parties: string[];
  court: string;
  status: string;
  summary: string;
};