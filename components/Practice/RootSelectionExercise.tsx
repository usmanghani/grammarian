"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { SentenceAnalysis } from "@/lib/grammar/types";

type RootSelectionExerciseProps = {
  sentence: SentenceAnalysis;
};

export function RootSelectionExercise({ sentence }: RootSelectionExerciseProps) {
  const rootId = useMemo(
    () => sentence.canonicalEdges.find((edge) => edge.relation === "root")?.dependentId,
    [sentence.canonicalEdges],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const selectedToken = sentence.tokens.find((token) => token.id === selectedId);
  const isCorrect = checked && selectedId === rootId;
  const isIncorrect = checked && selectedId !== null && selectedId !== rootId;

  function checkAnswer() {
    if (!selectedId) return;
    setChecked(true);
  }

  function reset() {
    setSelectedId(null);
    setChecked(false);
    setHintLevel(0);
  }

  return (
    <section className="practice-card" aria-labelledby="practice-sentence">
      <div className="practice-prompt">
        <span className="practice-step">Step 1</span>
        <h2 id="practice-sentence">Which word tells us what happened?</h2>
        <p>Choose the sentence’s main action. Then check your answer.</p>
      </div>
      <div className="practice-token-row" role="group" aria-label="Choose the main word">
        {sentence.tokens.filter((token) => token.upos !== "PUNCT").map((token) => {
          const isSelected = token.id === selectedId;
          const stateClass = isSelected ? (isCorrect ? " is-correct" : isIncorrect ? " is-incorrect" : "") : "";
          return (
            <Button
              key={token.id}
              type="button"
              variant={isSelected ? "secondary" : "outline"}
              className={`practice-token${stateClass}`}
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedId(token.id);
                setChecked(false);
              }}
            >
              <span>{token.form}</span>
              <small>{token.index}</small>
            </Button>
          );
        })}
      </div>
      <div className="practice-actions">
        <Button type="button" onClick={checkAnswer} disabled={!selectedId || isCorrect}>Check answer</Button>
        <Button type="button" variant="outline" onClick={() => setHintLevel((level) => Math.min(2, level + 1))} disabled={isCorrect || hintLevel >= 2}>
          {hintLevel === 0 ? "Hint" : hintLevel === 1 ? "Stronger hint" : "Hint shown"}
        </Button>
        {checked && !isCorrect ? <Button type="button" variant="ghost" onClick={reset}>Try again</Button> : null}
      </div>
      <div className="practice-feedback" aria-live="polite">
        {hintLevel === 1 ? <p><strong>Hint 1:</strong> Look for the verb that names the action.</p> : null}
        {hintLevel === 2 ? <p><strong>Hint 2:</strong> The main word is <em>{sentence.tokens.find((token) => token.id === rootId)?.form}</em>.</p> : null}
        {isCorrect ? <p className="feedback-correct"><strong>That’s it.</strong> <em>{selectedToken?.form}</em> is the action organizing this sentence.</p> : null}
        {isIncorrect ? <p className="feedback-incorrect"><strong>Not yet.</strong> Ask: which word tells us what happened?</p> : null}
      </div>
    </section>
  );
}
