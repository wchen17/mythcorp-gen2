export type Namespace = 'root' | 'other' | 'posts';

export type IndexHighlight = {
  name: string;
  url: string;
  blurb: string;
};

export type IndexCategory = {
  slug: string;
  namespace: Namespace;
  sourceFile: string;
  kind: 'catalog' | 'prose';
  name: string;
  emoji: string;
  blurb: string;
  sectionCount: number;
  entryCount: number;
  highlights: IndexHighlight[];
};

export type IndexFile = {
  fetchedAt: string;
  categories: IndexCategory[];
};
