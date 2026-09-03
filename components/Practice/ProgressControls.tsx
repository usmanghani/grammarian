"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { LocalProgressStore, type LessonProgress } from "@/lib/progress/store";

export function ProgressControls({ lessonId, totalSentences }: { lessonId: string; totalSentences: number }) {
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(new LocalProgressStore().load(lessonId)));
    return () => window.cancelAnimationFrame(frame);
  }, [lessonId]);

  function exportProgress() {
    const data = progress ?? { lessonId, completedSentenceIds: [], bestScores: {}, updatedAt: new Date().toISOString(), schemaVersion: 1 };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sentence-lab-${lessonId}-progress.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetProgress() {
    new LocalProgressStore().reset(lessonId);
    setProgress(null);
  }

  return <section className="progress-controls" aria-labelledby="progress-heading"><div><p className="eyebrow">On this device</p><h2 id="progress-heading">{progress?.completedSentenceIds.length ?? 0} of {totalSentences} sentences completed</h2></div><div className="practice-actions"><Button type="button" size="sm" variant="outline" onClick={exportProgress}>Export progress</Button><Button type="button" size="sm" variant="ghost" onClick={resetProgress} disabled={!progress}>Reset</Button></div></section>;
}
