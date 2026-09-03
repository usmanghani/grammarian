import type { DependencyEdge, SentenceAnalysis } from "./types";

export function validateSentence(sentence: SentenceAnalysis): string[] {
  const errors: string[] = [];
  const tokenIds = new Set(sentence.tokens.map((token) => token.id));
  const indexes = sentence.tokens.map((token) => token.index).sort((a, b) => a - b);

  if (new Set(sentence.tokens.map((token) => token.id)).size !== sentence.tokens.length) {
    errors.push(`${sentence.id}: token IDs must be unique`);
  }

  indexes.forEach((index, position) => {
    if (index !== position + 1) {
      errors.push(`${sentence.id}: token indices must be contiguous starting at 1`);
    }
  });

  const rootEdges = sentence.canonicalEdges.filter((edge) => edge.headId === "ROOT");
  if (rootEdges.length !== 1) {
    errors.push(`${sentence.id}: expected exactly one ROOT edge, found ${rootEdges.length}`);
  }

  const dependents = new Set<string>();
  for (const edge of sentence.canonicalEdges) {
    if (!tokenIds.has(edge.dependentId)) {
      errors.push(`${sentence.id}: edge dependent ${edge.dependentId} does not reference a token`);
    }
    if (edge.headId !== "ROOT" && !tokenIds.has(edge.headId)) {
      errors.push(`${sentence.id}: edge head ${edge.headId} does not reference a token`);
    }
    if (edge.headId === edge.dependentId) {
      errors.push(`${sentence.id}: token ${edge.dependentId} cannot depend on itself`);
    }
    if (dependents.has(edge.dependentId)) {
      errors.push(`${sentence.id}: token ${edge.dependentId} has more than one head`);
    }
    dependents.add(edge.dependentId);
  }

  for (const token of sentence.tokens) {
    if (!dependents.has(token.id)) {
      errors.push(`${sentence.id}: token ${token.id} is missing a head`);
    }
  }

  if (sentence.reviewStatus !== "draft" && (!sentence.reviewer || !sentence.reviewedAt)) {
    errors.push(`${sentence.id}: reviewed content needs reviewer and reviewedAt metadata`);
  }

  if (sentence.acceptedAlternatives) {
    sentence.acceptedAlternatives.forEach((alternative, index) => {
      errors.push(...validateEdges(sentence, alternative, `accepted alternative ${index + 1}`));
    });
  }

  errors.push(...validateAcyclicity(sentence, sentence.canonicalEdges, "canonical analysis"));
  return errors;
}

function validateEdges(sentence: SentenceAnalysis, edges: DependencyEdge[], label: string): string[] {
  const errors: string[] = [];
  const roots = edges.filter((edge) => edge.headId === "ROOT");
  if (roots.length !== 1) {
    errors.push(`${sentence.id}: ${label} must contain exactly one ROOT edge`);
  }
  const dependents = new Set<string>();
  const tokenIds = new Set(sentence.tokens.map((token) => token.id));
  for (const edge of edges) {
    if (!tokenIds.has(edge.dependentId)) {
      errors.push(`${sentence.id}: ${label} has unknown dependent ${edge.dependentId}`);
    }
    if (edge.headId !== "ROOT" && !tokenIds.has(edge.headId)) {
      errors.push(`${sentence.id}: ${label} has unknown head ${edge.headId}`);
    }
    if (dependents.has(edge.dependentId)) {
      errors.push(`${sentence.id}: ${label} gives ${edge.dependentId} more than one head`);
    }
    dependents.add(edge.dependentId);
  }
  if (dependents.size !== sentence.tokens.length) {
    errors.push(`${sentence.id}: ${label} must assign every token a head`);
  }
  errors.push(...validateAcyclicity(sentence, edges, label));
  return errors;
}

function validateAcyclicity(sentence: SentenceAnalysis, edges: DependencyEdge[], label: string): string[] {
  const parentByDependent = new Map(edges.map((edge) => [edge.dependentId, edge.headId]));
  const errors: string[] = [];

  for (const token of sentence.tokens) {
    const visited = new Set<string>();
    let current: string | "ROOT" = token.id;
    while (current !== "ROOT") {
      if (visited.has(current)) {
        errors.push(`${sentence.id}: ${label} contains a cycle involving ${current}`);
        break;
      }
      visited.add(current);
      const parent = parentByDependent.get(current);
      if (!parent) break;
      current = parent;
    }
  }

  return errors;
}

export function assertValidSentence(sentence: SentenceAnalysis): SentenceAnalysis {
  const errors = validateSentence(sentence);
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
  return sentence;
}
