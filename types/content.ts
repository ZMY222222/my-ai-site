export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type ArticleItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  sections: ArticleSection[];
};

export type ProjectItem = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  year: string;
  period?: string;
  company?: string;
  role?: string;
  background?: string;
  responsibilities?: string[];
  results?: string[];
  tags: string[];
  objective?: string;
  dataset?: string[];
  strategy?: string[];
  evaluation?: string[];
  result?: string;
  review?: string;
};

export type TrainingLogItem = {
  slug: string;
  title: string;
  date: string;
  phase: string;
  summary: string;
  observations: string[];
  adjustments: string[];
  outcome: string;
};
