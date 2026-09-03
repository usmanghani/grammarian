"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { RELATION_LABELS } from "@/lib/grammar/labels";
import type { DependencyEdge, SentenceAnalysis, UdRelation } from "@/lib/grammar/types";

export function FindErrorExercise({ sentence }: { sentence: SentenceAnalysis }) {
  const target = useMemo(() => sentence.canonicalEdges.find((edge) => ["amod", "det", "advmod", "obj", "nsubj"].includes(edge.relation)), [sentence.canonicalEdges]);
  const wrongRelation = target?.relation === "obj" ? "nsubj" : "obj";
  const [selected, setSelected] = useState<DependencyEdge | null>(null);
  const [replacement, setReplacement] = useState<UdRelation | null>(null);
  const [checked, setChecked] = useState(false);

  if (!target) return null;
  const head = sentence.tokens.find((token) => token.id === target.headId)?.form ?? "main word";
  const dependent = sentence.tokens.find((token) => token.id === target.dependentId)?.form ?? "word";
  const options = Array.from(new Set<UdRelation>([target.relation, wrongRelation, "det", "amod"]));
  const correct = checked && selected?.dependentId === target.dependentId && replacement === target.relation;

  return <section className="practice-card" aria-labelledby="find-error-heading">
    <div className="practice-prompt"><span className="practice-step">Challenge</span><h2 id="find-error-heading">Find one wrong label</h2><p>One connection in this reviewed diagram is mislabeled. Select it, then choose the label that fits.</p></div>
    <div className="practice-token-row" role="group" aria-label="Choose a connection to inspect"><Button type="button" variant={selected ? "secondary" : "outline"} className={`practice-token${checked && !correct ? " is-incorrect" : ""}`} onClick={() => { setSelected(target); setChecked(false); }}>{head} → {dependent}<small>{checked && !correct ? wrongRelation : "relation"}</small></Button></div>
    {selected ? <div className="practice-label-picker" aria-label="Choose the corrected relationship">{options.map((relation) => <Button key={relation} type="button" size="sm" variant={replacement === relation ? "secondary" : "outline"} onClick={() => { setReplacement(relation); setChecked(false); }}>{RELATION_LABELS[relation].shortLabel}</Button>)}</div> : null}
    <div className="practice-actions"><Button type="button" onClick={() => setChecked(true)} disabled={!selected || !replacement}>Check correction</Button></div>
    <div className="practice-feedback" aria-live="polite">{checked ? <p className={correct ? "feedback-correct" : "feedback-incorrect"}><strong>{correct ? "Correct." : "Look again."}</strong> {correct ? `${RELATION_LABELS[target.relation].longLabel} explains how ${dependent} connects to ${head}.` : "Ask what job the dependent word does for its head."}</p> : null}</div>
  </section>;
}
