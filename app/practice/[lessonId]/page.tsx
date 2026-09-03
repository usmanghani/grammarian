import Link from "next/link";
import { ArrowLeft, Network } from "lucide-react";
import { notFound } from "next/navigation";

import introLessonJson from "@/content/lessons/intro.json";
import { DependencyDiagram } from "@/components/DependencyDiagram/DependencyDiagram";
import { RootSelectionExercise } from "@/components/Practice/RootSelectionExercise";
import { Button } from "@/components/ui/button";
import { assertValidSentence } from "@/lib/grammar/validation";
import type { Lesson } from "@/lib/grammar/types";

const lesson = introLessonJson as unknown as Lesson;

type PracticePageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function PracticePage({ params }: PracticePageProps) {
  const { lessonId } = await params;
  if (lessonId !== lesson.id) notFound();
  const sentence = assertValidSentence(lesson.sentences[0]);

  return (
    <main className="site-shell lesson-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Sentence Lab home">
          <span className="brand-mark" aria-hidden="true"><Network size={19} /></span>
          <span>Sentence Lab</span>
        </Link>
        <Button asChild variant="ghost" size="sm"><Link href={`/learn/${lesson.id}`}><ArrowLeft size={16} /> Explore first</Link></Button>
      </header>

      <section className="lesson-header practice-header">
        <p className="eyebrow">Guided practice · 1 of 5</p>
        <h1>Find the main word</h1>
        <p>Tap the word that organizes this sentence. You can inspect the completed map below if you need a reminder.</p>
      </section>

      <RootSelectionExercise sentence={sentence} />

      <DependencyDiagram sentence={sentence} showRelationsByDefault={false} />
    </main>
  );
}
