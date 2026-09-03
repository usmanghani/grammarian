import type { DependencyEdge, SentenceAnalysis } from "./types";

export type StudentParse = {
  sentenceId: string;
  posByTokenId: Record<string, string>;
  edgeByDependentId: Record<string, { headId: string; relation: string }>;
  hintCount: number;
  revealed: boolean;
};

export type Score = { posAccuracy: number; rootCorrect: boolean; uas: number; las: number; hints: number; revealed: boolean; completion: number };

export function scoreParse(sentence: SentenceAnalysis, answer: StudentParse, includePunctuation = false): Score {
  const tokens = sentence.tokens.filter((token) => includePunctuation || token.upos !== "PUNCT");
  const root = sentence.canonicalEdges.find((edge) => edge.relation === "root")?.dependentId;
  const posCorrect = tokens.filter((token) => answer.posByTokenId[token.id] === token.upos).length;
  const edges = sentence.canonicalEdges.filter((edge) => includePunctuation || edge.relation !== "punct");
  const uas = edges.length === 0 ? 1 : edges.filter((edge) => answer.edgeByDependentId[edge.dependentId]?.headId === edge.headId).length / edges.length;
  const las = edges.length === 0 ? 1 : edges.filter((edge) => {
    const submitted = answer.edgeByDependentId[edge.dependentId];
    return submitted?.headId === edge.headId && submitted.relation === edge.relation;
  }).length / edges.length;
  const posAccuracy = tokens.length === 0 ? 1 : posCorrect / tokens.length;
  return { posAccuracy, rootCorrect: Boolean(root && answer.edgeByDependentId[root]?.headId === "ROOT"), uas, las, hints: answer.hintCount, revealed: answer.revealed, completion: (posAccuracy + uas + las) / 3 };
}

export function edgeMap(edges: DependencyEdge[]): StudentParse["edgeByDependentId"] {
  return Object.fromEntries(edges.map((edge) => [edge.dependentId, { headId: edge.headId, relation: edge.relation }]));
}
