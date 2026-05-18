export type CatalogEntry = {
  name: string;
  url: string;
  blurb: string;
  badges: string[];
  resourceLinks: { text: string; url: string }[];
};

export type CatalogSection = {
  heading: string;
  subheading?: string;
  entries: CatalogEntry[];
};

export type Namespace = 'root' | 'other' | 'posts';

export type CatalogCategory = {
  slug: string;
  namespace: Namespace;
  sourceFile: string;
  sections: CatalogSection[];
};

export type CatalogProse = {
  slug: string;
  namespace: Namespace;
  sourceFile: string;
  title: string;
  description?: string;
  html: string;
};

export type Catalog = {
  fetchedAt: string;
  categories: CatalogCategory[];
};

export type ProseDoc = {
  fetchedAt: string;
  doc: CatalogProse;
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
  highlights: { name: string; url: string; blurb: string }[];
};

export type IndexFile = {
  fetchedAt: string;
  categories: IndexCategory[];
};
