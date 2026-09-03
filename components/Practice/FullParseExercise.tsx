"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getPosLabel, RELATION_LABELS } from "@/lib/grammar/labels";
import { scoreParse, type StudentParse } from "@/lib/grammar/scoring";
import { LocalProgressStore } from "@/lib/progress/store";
import type { SentenceAnalysis, UdRelation, UposTag } from "@/lib/grammar/types";

type Phase = "pos" | "root" | "edges" | "review";

export function FullParseExercise({ sentence }: { sentence: SentenceAnalysis }) {
  const nonPunctuation = useMemo(() => sentence.tokens.filter((token) => token.upos !== "PUNCT"), [sentence.tokens]);
  const [phase, setPhase] = useState<Phase>("pos");
  const [activeTokenId, setActiveTokenId] = useState<string | null>(nonPunctuation[0]?.id ?? null);
  const [pos, setPos] = useState<Record<string, UposTag>>({});
  const [root, setRoot] = useState<string | null>(null);
  const [edges, setEdges] = useState<Record<string, { headId: string; relation: UdRelation }>>({});
  const [selectedHead, setSelectedHead] = useState<string | null>(null);
  const [score, setScore] = useState<ReturnType<typeof scoreParse> | null>(null);
  const [saved, setSaved] = useState(false);

  const availablePos = Array.from(new Set<UposTag>(nonPunctuation.map((token) => token.upos)));
  const targetDependent = nonPunctuation.find((token) => token.id !== root && !edges[token.id]);
  const targetEdge = targetDependent ? sentence.canonicalEdges.find((edge) => edge.dependentId === targetDependent.id) : null;
  const relationOptions = Array.from(new Set<UdRelation>(["nsubj", "obj", "det", "amod", "advmod", targetEdge?.relation].filter((value): value is UdRelation => Boolean(value))));
  const allPosLabeled = nonPunctuation.every((token) => pos[token.id]);
  const allEdgesBuilt = nonPunctuation.filter((token) => token.id !== root).every((token) => edges[token.id]);

  function selectPos(tag: UposTag) {
    if (!activeTokenId) return;
    setPos((current) => ({ ...current, [activeTokenId]: tag }));
    setActiveTokenId(nonPunctuation.find((token) => token.id !== activeTokenId && !pos[token.id])?.id ?? null);
  }

  function submit() {
    if (!root || !allPosLabeled || !allEdgesBuilt) return;
    const answer: StudentParse = { sentenceId: sentence.id, posByTokenId: { ...pos }, edgeByDependentId: { ...edges, [root]: { headId: "ROOT", relation: "root" } }, hintCount: 0, revealed: false };
    const result = scoreParse(sentence, answer);
    setScore(result);
    setPhase("review");
    const store = new LocalProgressStore();
    const previous = store.load("intro") ?? { lessonId: "intro", completedSentenceIds: [], bestScores: {}, updatedAt: "", schemaVersion: 1 };
    store.save({ ...previous, completedSentenceIds: result.completion === 1 && !previous.completedSentenceIds.includes(sentence.id) ? [...previous.completedSentenceIds, sentence.id] : previous.completedSentenceIds, bestScores: { ...previous.bestScores, [sentence.id]: Math.max(previous.bestScores[sentence.id] ?? 0, result.completion) }, updatedAt: new Date().toISOString() });
    setSaved(true);
  }

  return <section className="practice-card full-parse-card" aria-labelledby="full-parse-heading">
    <div className="practice-prompt"><span className="practice-step">Final challenge</span><h2 id="full-parse-heading">Build the whole map</h2><p>Label the words, choose the main word, then connect each dependent to its head and relationship.</p></div>
    <div className="full-parse-progress" aria-label="Full parse progress"><span className={phase === "pos" ? "is-active" : ""}>1 word classes</span><span className={phase === "root" ? "is-active" : ""}>2 main word</span><span className={phase === "edges" ? "is-active" : ""}>3 connections</span><span className={phase === "review" ? "is-active" : ""}>4 result</span></div>
    {phase === "pos" ? <>
      <div className="practice-token-row" role="group" aria-label="Choose a word to label">{nonPunctuation.map((token) => <Button key={token.id} type="button" variant={activeTokenId === token.id ? "secondary" : "outline"} className="practice-token" onClick={() => setActiveTokenId(token.id)}><span>{token.form}</span><small>{pos[token.id] ? getPosLabel(pos[token.id]).shortLabel : token.index}</small></Button>)}</div>
      <div className="practice-label-picker" aria-label="Word class choices">{availablePos.map((tag) => <Button key={tag} size="sm" type="button" variant={activeTokenId && pos[activeTokenId] === tag ? "secondary" : "outline"} onClick={() => selectPos(tag)}>{getPosLabel(tag).shortLabel}</Button>)}</div>
      <div className="practice-actions"><Button type="button" onClick={() => { setRoot(null); setPhase("root"); setActiveTokenId(null); }} disabled={!allPosLabeled}>Continue to main word</Button></div>
    </> : null}
    {phase === "root" ? <>
      <div className="practice-token-row" role="group" aria-label="Choose the main word">{nonPunctuation.map((token) => <Button key={token.id} type="button" variant={root === token.id ? "secondary" : "outline"} className="practice-token" onClick={() => setRoot(token.id)}>{token.form}</Button>)}</div>
      <div className="practice-actions"><Button type="button" onClick={() => setPhase("edges")} disabled={!root}>Continue to connections</Button></div>
    </> : null}
    {phase === "edges" ? <>
      <p className="practice-placeholder">Connect <strong>{targetDependent?.form ?? "all words"}</strong> to its head, then choose its relationship.</p>
      <div className="practice-token-row" role="group" aria-label="Choose the head">{nonPunctuation.filter((token) => token.id !== targetDependent?.id).map((token) => <Button key={token.id} type="button" variant={selectedHead === token.id ? "secondary" : "outline"} className="practice-token" onClick={() => setSelectedHead(token.id)}>{token.form}</Button>)}</div>
      {selectedHead ? <div className="practice-label-picker" aria-label="Choose the relationship">{relationOptions.map((relation) => <Button key={relation} type="button" size="sm" onClick={() => { if (!targetDependent) return; setEdges((current) => ({ ...current, [targetDependent.id]: { headId: selectedHead, relation } })); setSelectedHead(null); }}>{RELATION_LABELS[relation].shortLabel}</Button>)}</div> : null}
      <div className="practice-actions"><Button type="button" onClick={submit} disabled={!allEdgesBuilt}>Check full parse</Button></div>
    </> : null}
    {phase === "review" && score ? <div className="full-parse-result" aria-live="polite"><p className={score.completion === 1 ? "feedback-correct" : "feedback-incorrect"}><strong>{score.completion === 1 ? "Complete and correct." : "Keep practicing this structure."}</strong></p><dl><div><dt>Word classes</dt><dd>{Math.round(score.posAccuracy * 100)}%</dd></div><div><dt>Connections</dt><dd>{Math.round(score.uas * 100)}%</dd></div><div><dt>Connections + labels</dt><dd>{Math.round(score.las * 100)}%</dd></div></dl>{saved ? <p className="practice-placeholder">Your best result is saved on this device.</p> : null}<Button type="button" variant="outline" onClick={() => { setPhase("pos"); setScore(null); setSaved(false); setEdges({}); setRoot(null); setPos({}); }}>Try again</Button></div> : null}
  </section>;
}
