import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonDirectory = path.join(root, "content", "lessons");
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
  for (const sentence of lesson.sentences) validateSentence(sentence, filename);
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
  for (const edge of edges) {
    if (!tokenIds.has(edge.dependentId)) errors.push(`unknown dependent ${edge.dependentId}`);
    if (edge.headId !== "ROOT" && !tokenIds.has(edge.headId)) errors.push(`unknown head ${edge.headId}`);
    if (edge.headId === edge.dependentId) errors.push(`token ${edge.dependentId} cannot depend on itself`);
    if (dependents.has(edge.dependentId)) errors.push(`token ${edge.dependentId} has more than one head`);
    dependents.add(edge.dependentId);
    parentByDependent.set(edge.dependentId, edge.headId);
  }
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
  if (errors.length) throw new Error(`${prefix}: ${errors.join("; ")}`);
}
