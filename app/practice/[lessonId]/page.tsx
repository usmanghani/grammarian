import Link from "next/link";
import { ArrowLeft, ArrowRight, Network } from "lucide-react";
import { notFound } from "next/navigation";

import introLessonJson from "@/content/lessons/intro.json";
import { DependencyDiagram } from "@/components/DependencyDiagram/DependencyDiagram";
import { RootSelectionExercise } from "@/components/Practice/RootSelectionExercise";
import { PosLabelExercise } from "@/components/Practice/PosLabelExercise";
import { EdgeConstructionExercise } from "@/components/Practice/EdgeConstructionExercise";
import { FullParseExercise } from "@/components/Practice/FullParseExercise";
import { Button } from "@/components/ui/button";
import { assertValidSentence } from "@/lib/grammar/validation";
import type { Lesson } from "@/lib/grammar/types";

const lesson = introLessonJson as unknown as Lesson;

type PracticePageProps = {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ sentence?: string }>;
};

export default async function PracticePage({ params, searchParams }: PracticePageProps) {
  const { lessonId } = await params;
  const { sentence: sentenceParam } = await searchParams;
  if (lessonId !== lesson.id) notFound();
  const sentenceIndex = Math.max(0, Math.min(lesson.sentences.length - 1, Number.parseInt(sentenceParam ?? "0", 10) || 0));
  const sentence = assertValidSentence(lesson.sentences[sentenceIndex]);

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
        <p className="eyebrow">Guided practice · sentence {sentenceIndex + 1} of {lesson.sentences.length}</p>
        <h1>Find the main word</h1>
        <p>Tap the word that organizes this sentence. You can inspect the completed map below if you need a reminder.</p>
      </section>

      <RootSelectionExercise sentence={sentence} />
      <PosLabelExercise sentence={sentence} />
      <EdgeConstructionExercise sentence={sentence} />
      <FullParseExercise sentence={sentence} />

      <nav className="practice-navigation" aria-label="Practice sentence navigation">
        {sentenceIndex > 0 ? <Button asChild variant="outline"><Link href={`/practice/${lesson.id}?sentence=${sentenceIndex - 1}`}><ArrowLeft size={15} /> Previous sentence</Link></Button> : <span />}
        {sentenceIndex < lesson.sentences.length - 1 ? <Button asChild><Link href={`/practice/${lesson.id}?sentence=${sentenceIndex + 1}`}>Next sentence <ArrowRight size={15} /></Link></Button> : <span className="practice-complete-note">You reached the end of this reviewed set.</span>}
      </nav>

      <DependencyDiagram sentence={sentence} showRelationsByDefault={false} />
    </main>
  );
}
