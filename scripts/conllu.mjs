#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const [, , command, inputPath, outputPath] = process.argv;
if (!command || !inputPath || !outputPath || !["import", "export"].includes(command)) {
  console.error("Usage: node scripts/conllu.mjs <import|export> <input> <output>");
  process.exit(64);
}

const input = await readFile(inputPath, "utf8");
if (command === "import") {
  const sentence = importSentence(input);
  await writeFile(outputPath, `${JSON.stringify(sentence, null, 2)}\n`);
} else {
  const sentence = JSON.parse(input);
  await writeFile(outputPath, exportSentence(sentence));
}

function importSentence(source) {
  const comments = source.split(/\r?\n/).filter((line) => line.startsWith("#"));
  const text = comments.find((line) => line.startsWith("# text = "))?.slice(9);
  const id = comments.find((line) => line.startsWith("# sent_id = "))?.slice(12) ?? "imported-sentence";
  if (!text) throw new Error("CoNLL-U import requires a '# text = ...' comment");
  const rows = source.split(/\r?\n/).filter((line) => line && !line.startsWith("#"));
  const tokens = [];
  const edges = [];
  let cursor = 0;
  for (const row of rows) {
    const fields = row.split("\t");
    if (fields.length < 10) throw new Error(`CoNLL-U row has ${fields.length} fields; expected 10`);
    const [rawId, form, lemma, upos, xpos, , rawHead, relation] = fields;
    if (rawId.includes("-") || rawId.includes(".")) throw new Error(`Unsupported multiword or empty node ID: ${rawId}`);
    const index = Number(rawId);
    const head = Number(rawHead);
    if (!Number.isInteger(index) || !Number.isInteger(head)) throw new Error(`Invalid token index or HEAD in row: ${rawId}`);
    const start = text.indexOf(form, cursor);
    if (start < 0) throw new Error(`Could not locate token '${form}' in surface text after character ${cursor}`);
    const tokenId = `t${index}`;
    tokens.push({ id: tokenId, index, form, lemma: lemma === "_" ? undefined : lemma, upos, xpos: xpos === "_" ? undefined : xpos, start, end: start + form.length });
    edges.push({ dependentId: tokenId, headId: head === 0 ? "ROOT" : `t${head}`, relation });
    cursor = start + form.length;
  }
  return { id, text, language: "en", tokens, canonicalEdges: edges, concepts: [], difficulty: 1, source: "CoNLL-U import", reviewStatus: "draft", schemaVersion: 1 };
}

function exportSentence(sentence) {
  const edgeByDependent = new Map(sentence.canonicalEdges.map((edge) => [edge.dependentId, edge]));
  const tokenById = new Map(sentence.tokens.map((token) => [token.id, token]));
  const lines = [`# sent_id = ${sentence.id}`, `# text = ${sentence.text}`];
  for (const token of sentence.tokens) {
    const edge = edgeByDependent.get(token.id);
    if (!edge) throw new Error(`Token ${token.id} has no dependency edge`);
    const head = edge.headId === "ROOT" ? 0 : tokenById.get(edge.headId)?.index;
    if (head === undefined) throw new Error(`Unknown head ${edge.headId} for token ${token.id}`);
    lines.push([token.index, token.form, token.lemma ?? "_", token.upos, token.xpos ?? "_", "_", head, edge.relation, "_", "_"].join("\t"));
  }
  return `${lines.join("\n")}\n`;
}
