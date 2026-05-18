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

export type CatalogCategory = {
  slug: string;
  sourceFile: string;
  sections: CatalogSection[];
};

export type Catalog = {
  fetchedAt: string;
  categories: CatalogCategory[];
};
