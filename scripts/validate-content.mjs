import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonDirectory = path.join(root, "content", "lessons");
const uposTags = new Set(["NOUN", "PROPN", "PRON", "VERB", "ADJ", "DET", "PUNCT", "ADV", "AUX", "ADP", "PART", "NUM", "CCONJ", "SCONJ", "INTJ", "SYM", "X"]);
const relations = new Set(["root", "nsubj", "obj", "det", "amod", "advmod", "aux", "cop", "iobj", "case", "obl", "nmod:poss", "compound", "cc", "conj", "mark", "xcomp", "ccomp", "acl", "advcl", "punct"]);
const filenames = (await readdir(lessonDirectory)).filter((filename) => filename.endsWith(".json"));

if (filenames.length === 0) {
  throw new Error("No lesson JSON files found.");
}

for (const filename of filenames.sort()) {
  const lesson = JSON.parse(await readFile(path.join(lessonDirectory, filename), "utf8"));
  if (!lesson.id || !lesson.title || !lesson.profileId || !Array.isArray(lesson.sentences)) {
    throw new Error(`${filename}: lesson requires id, title, profileId, and sentences`);
  }
  if (lesson.sentences.length === 0) {
    throw new Error(`${filename}: lesson must contain at least one sentence`);
  }
  const sentenceIds = new Set();
  for (const sentence of lesson.sentences) validateSentence(sentence, filename);
  for (const sentence of lesson.sentences) {
    if (sentenceIds.has(sentence.id)) throw new Error(`${filename}: duplicate sentence id ${sentence.id}`);
    sentenceIds.add(sentence.id);
  }
  console.log(`validated ${filename} (${lesson.sentences.length} sentence${lesson.sentences.length === 1 ? "" : "s"})`);
}

function validateSentence(sentence, filename) {
  const prefix = `${filename}: ${sentence.id ?? "unknown sentence"}`;
  const errors = [];
  if (!sentence.id || !sentence.text || sentence.language !== "en") errors.push("requires id, text, and language en");
  if (!Array.isArray(sentence.tokens) || sentence.tokens.length === 0) errors.push("requires tokens");
  if (!Array.isArray(sentence.canonicalEdges)) errors.push("requires canonicalEdges");
  if (sentence.reviewStatus === "published" && (!sentence.reviewer || !sentence.reviewedAt || !sentence.explanation)) {
    errors.push("published content requires reviewer, reviewedAt, and explanation");
  }
  const tokens = sentence.tokens ?? [];
  const tokenIds = new Set(tokens.map((token) => token.id));
  const indexes = tokens.map((token) => token.index).sort((a, b) => a - b);
  if (new Set(tokens.map((token) => token.id)).size !== tokens.length) errors.push("token IDs must be unique");
  indexes.forEach((index, position) => {
    if (index !== position + 1) errors.push("token indices must be contiguous starting at 1");
  });

  const edges = sentence.canonicalEdges ?? [];
  const rootEdges = edges.filter((edge) => edge.headId === "ROOT");
  if (rootEdges.length !== 1) errors.push(`expected exactly one ROOT edge, found ${rootEdges.length}`);
  const dependents = new Set();
  const parentByDependent = new Map();
  let cursor = 0;
  for (const edge of edges) {
    if (!tokenIds.has(edge.dependentId)) errors.push(`unknown dependent ${edge.dependentId}`);
    if (edge.headId !== "ROOT" && !tokenIds.has(edge.headId)) errors.push(`unknown head ${edge.headId}`);
    if (edge.headId === edge.dependentId) errors.push(`token ${edge.dependentId} cannot depend on itself`);
    if (!relations.has(edge.relation)) errors.push(`unsupported relation ${edge.relation}`);
    if (dependents.has(edge.dependentId)) errors.push(`token ${edge.dependentId} has more than one head`);
    dependents.add(edge.dependentId);
    parentByDependent.set(edge.dependentId, edge.headId);
  }
  for (const token of [...tokens].sort((a, b) => a.index - b.index)) {
    if (!uposTags.has(token.upos)) errors.push(`unsupported UPOS tag ${token.upos}`);
    if (!Number.isInteger(token.start) || !Number.isInteger(token.end) || token.start < 0 || token.end < token.start) errors.push(`invalid character span for ${token.id}`);
    if (sentence.text.slice(token.start, token.end) !== token.form) errors.push(`span for ${token.id} does not reproduce '${token.form}'`);
    if (token.start < cursor) errors.push(`span for ${token.id} overlaps a previous token`);
    cursor = Math.max(cursor, token.end);
  }
  if (cursor > sentence.text.length) errors.push("token span exceeds sentence text length");
  for (const token of tokens) if (!dependents.has(token.id)) errors.push(`token ${token.id} is missing a head`);
  for (const token of tokens) {
    const seen = new Set();
    let current = token.id;
    while (current !== "ROOT") {
      if (seen.has(current)) {
        errors.push(`dependency cycle involves ${current}`);
        break;
      }
      seen.add(current);
      current = parentByDependent.get(current);
      if (!current) break;
    }
  }
  for (const token of tokens) {
    const seen = new Set();
    let current = token.id;
    while (current && current !== "ROOT" && !seen.has(current)) {
      seen.add(current);
      current = parentByDependent.get(current);
    }
    if (current !== "ROOT") errors.push(`token ${token.id} is not connected to ROOT`);
  }
  if (errors.length) throw new Error(`${prefix}: ${errors.join("; ")}`);
}
