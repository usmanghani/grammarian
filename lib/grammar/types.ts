export const UPOS_TAGS = [
  "NOUN",
  "PROPN",
  "PRON",
  "VERB",
  "ADJ",
  "DET",
  "PUNCT",
  "ADV",
  "AUX",
  "ADP",
  "PART",
  "NUM",
  "CCONJ",
  "SCONJ",
  "INTJ",
  "SYM",
  "X",
] as const;

export type UposTag = (typeof UPOS_TAGS)[number];

export const UD_RELATIONS = [
  "root",
  "nsubj",
  "obj",
  "det",
  "amod",
  "advmod",
  "aux",
  "cop",
  "iobj",
  "case",
  "obl",
  "nmod:poss",
  "compound",
  "cc",
  "conj",
  "mark",
  "xcomp",
  "ccomp",
  "acl",
  "advcl",
  "punct",
] as const;

export type UdRelation = (typeof UD_RELATIONS)[number];

export type Token = {
  id: string;
  index: number;
  form: string;
  lemma?: string;
  upos: UposTag;
  start: number;
  end: number;
};

export type DependencyEdge = {
  dependentId: string;
  headId: string | "ROOT";
  relation: UdRelation;
  displayLabel?: string;
  explanation?: string;
};

export type SentenceAnalysis = {
  id: string;
  text: string;
  language: "en";
  tokens: Token[];
  canonicalEdges: DependencyEdge[];
  acceptedAlternatives?: DependencyEdge[][];
  concepts: string[];
  difficulty: 1 | 2 | 3;
  explanation?: string;
  source?: string;
  reviewer?: string;
  reviewedAt?: string;
  reviewStatus: "draft" | "reviewed" | "published";
  schemaVersion: number;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  profileId: string;
  level: 1 | 2 | 3;
  sentences: SentenceAnalysis[];
};
