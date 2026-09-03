"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { RELATION_LABELS } from "@/lib/grammar/labels";
import type { DependencyEdge, SentenceAnalysis, UdRelation } from "@/lib/grammar/types";

export function EdgeConstructionExercise({ sentence }: { sentence: SentenceAnalysis }) {
  const targets = useMemo(() => sentence.canonicalEdges.filter((edge) => edge.relation !== "root" && edge.relation !== "punct"), [sentence.canonicalEdges]);
  const [dependentId, setDependentId] = useState<string | null>(null);
  const [headId, setHeadId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Pick<DependencyEdge, "headId" | "relation">>>({});
  const [checked, setChecked] = useState(false);

  const currentTarget = targets.find((edge) => !answers[edge.dependentId]);
  const relationChoices = targets.find((edge) => edge.dependentId === dependentId)?.relation ?? "nsubj";
  const relationOptions = ["nsubj", "obj", "det", "amod", "advmod"] as UdRelation[];
  const complete = targets.every((edge) => answers[edge.dependentId]);
  const correct = targets.filter((edge) => answers[edge.dependentId]?.headId === edge.headId && answers[edge.dependentId]?.relation === edge.relation).length;

  function chooseToken(id: string) {
    if (!currentTarget) return;
    if (!dependentId) setDependentId(id);
    else if (!headId && id !== dependentId) setHeadId(id);
  }

  function saveRelation(relation: UdRelation) {
    if (!dependentId || !headId) return;
    setAnswers((current) => ({ ...current, [dependentId]: { headId, relation } }));
    setDependentId(null);
    setHeadId(null);
    setChecked(false);
  }

  return <section className="practice-card" aria-labelledby="edge-practice-heading">
    <div className="practice-prompt"><span className="practice-step">Step 3</span><h2 id="edge-practice-heading">Build the connections</h2><p>Tap a dependent word, tap its head, then choose the relationship.</p></div>
    <div className="practice-token-row" role="group" aria-label="Choose dependency tokens">
      {sentence.tokens.filter((token) => token.upos !== "PUNCT").map((token) => {
        const selected = token.id === dependentId || token.id === headId;
        const saved = answers[token.id];
        return <Button key={token.id} type="button" variant={selected ? "secondary" : "outline"} className="practice-token" aria-pressed={selected} onClick={() => chooseToken(token.id)}><span>{token.form}</span><small>{saved ? RELATION_LABELS[saved.relation].shortLabel : token.index}</small></Button>;
      })}
    </div>
    {dependentId && headId ? <div className="practice-label-picker" aria-label="Choose dependency relation">{relationOptions.map((relation) => <Button key={relation} type="button" size="sm" variant={relation === relationChoices ? "secondary" : "outline"} onClick={() => saveRelation(relation)}>{RELATION_LABELS[relation].shortLabel}</Button>)}</div> : <p className="practice-placeholder">{currentTarget ? `Next: choose ${sentence.tokens.find((token) => token.id === currentTarget.dependentId)?.form ?? "a word"}.` : "All connections are selected."}</p>}
    <div className="practice-actions"><Button type="button" onClick={() => setChecked(true)} disabled={!complete}>Check connections</Button></div>
    <div className="practice-feedback" aria-live="polite">{checked ? <p className={correct === targets.length ? "feedback-correct" : "feedback-incorrect"}><strong>{correct} of {targets.length} correct.</strong> {correct === targets.length ? "Every connection has the right head and label." : "Review the highlighted relationship in the completed diagram."}</p> : null}</div>
  </section>;
}
