export type HadithEntry = {
  id: string;
  collection: string;
  book?: string;
  number: string;
  reference: string;

  topic?: string;
  keywords?: string[];

  arabic?: string;
  transliteration?: string;
  translation: string;

  primarySources?: string[];
  authenticity?: string;

  explanation?: string;
  lessons?: string[];
  practicalApplications?: string[];

  sourceUrl?: string;
  isCurated?: boolean;
};