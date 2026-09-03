"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { POS_LABELS } from "@/lib/grammar/labels";
import type { SentenceAnalysis, UposTag } from "@/lib/grammar/types";

const lessonTags: UposTag[] = ["NOUN", "VERB", "ADJ", "DET", "PUNCT"];

export function PosLabelExercise({ sentence }: { sentence: SentenceAnalysis }) {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, UposTag>>({});
  const [checked, setChecked] = useState(false);

  const completed = sentence.tokens.filter((token) => token.upos !== "PUNCT").every((token) => answers[token.id]);
  const correctCount = sentence.tokens.filter((token) => answers[token.id] === token.upos).length;

  return (
    <section className="practice-card" aria-labelledby="pos-practice-heading">
      <div className="practice-prompt">
        <span className="practice-step">Step 2</span>
        <h2 id="pos-practice-heading">What kind of word is each one?</h2>
        <p>Select a word, then choose its word class. The period is shown as a reminder but is not scored.</p>
      </div>
      <div className="practice-token-row" role="group" aria-label="Choose a word to label">
        {sentence.tokens.filter((token) => token.upos !== "PUNCT").map((token) => {
          const answer = answers[token.id];
          const state = checked ? (answer === token.upos ? " is-correct" : answer ? " is-incorrect" : "") : "";
          return <Button key={token.id} type="button" variant={activeTokenId === token.id ? "secondary" : "outline"} className={`practice-token${state}`} aria-pressed={activeTokenId === token.id} onClick={() => setActiveTokenId(token.id)}><span>{token.form}</span><small>{answer ? POS_LABELS[answer].shortLabel : token.index}</small></Button>;
        })}
      </div>
      {activeTokenId ? <div className="practice-label-picker" aria-label="Choose a word class">
        {lessonTags.map((tag) => <Button key={tag} type="button" size="sm" variant={answers[activeTokenId] === tag ? "secondary" : "outline"} onClick={() => { setAnswers((current) => ({ ...current, [activeTokenId]: tag })); setChecked(false); }}>{POS_LABELS[tag].shortLabel}</Button>)}
      </div> : <p className="practice-placeholder">Choose a word to open its word-class choices.</p>}
      <div className="practice-actions"><Button type="button" onClick={() => setChecked(true)} disabled={!completed}>Check labels</Button></div>
      <div className="practice-feedback" aria-live="polite">{checked ? <p className={correctCount === sentence.tokens.filter((token) => token.upos !== "PUNCT").length ? "feedback-correct" : "feedback-incorrect"}><strong>{correctCount} correct.</strong> {correctCount === sentence.tokens.filter((token) => token.upos !== "PUNCT").length ? "You can now look at what each word does in the sentence." : "Try the highlighted words again."}</p> : null}</div>
    </section>
  );
}
