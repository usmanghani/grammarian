import Link from "next/link";
import { ArrowLeft, ArrowRight, Network } from "lucide-react";
import { notFound } from "next/navigation";

import introLessonJson from "@/content/lessons/intro.json";
import { DependencyDiagram } from "@/components/DependencyDiagram/DependencyDiagram";
import { Button } from "@/components/ui/button";
import { assertValidSentence } from "@/lib/grammar/validation";
import type { Lesson } from "@/lib/grammar/types";

const lesson = introLessonJson as unknown as Lesson;

type LearnPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LearnPage({ params }: LearnPageProps) {
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
        <Button asChild variant="ghost" size="sm"><Link href="/"><ArrowLeft size={16} /> Home</Link></Button>
      </header>

      <section className="lesson-header">
        <p className="eyebrow">Lesson 1 · Find the center</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.description} Begin with the completed map, then try making the connections yourself.</p>
      </section>

      <DependencyDiagram sentence={sentence} />

      <div className="lesson-next">
        <div>
          <p className="eyebrow">Ready to try?</p>
          <p>Choose the main word, connect the dependents, and label each relationship.</p>
        </div>
        <Button asChild size="lg"><Link href={`/practice/${lesson.id}`}>Open practice <ArrowRight size={17} /></Link></Button>
      </div>
    </main>
  );
}
