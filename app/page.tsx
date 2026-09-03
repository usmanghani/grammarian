import Link from "next/link";
import { ArrowRight, BookOpen, Network, Sparkles } from "lucide-react";

import introLessonJson from "@/content/lessons/intro.json";
import { DependencyDiagram } from "@/components/DependencyDiagram/DependencyDiagram";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assertValidSentence } from "@/lib/grammar/validation";
import type { Lesson } from "@/lib/grammar/types";

const lesson = introLessonJson as unknown as Lesson;
const sentence = assertValidSentence(lesson.sentences[0]);

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Sentence Lab home">
          <span className="brand-mark" aria-hidden="true"><Network size={19} /></span>
          <span>Sentence Lab</span>
        </Link>
        <nav className="topnav" aria-label="Main navigation">
          <Link href="/learn/intro">Learn</Link>
          <Link href="/practice/intro">Practice</Link>
        </nav>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> English sentence structure</p>
          <h1>See how every word fits together.</h1>
          <p className="hero-description">
            Explore a sentence as a living map of words, then practice finding each word’s job and connection.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link href="/learn/intro">Explore a sentence <ArrowRight size={17} /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/practice/intro">Try practice</Link>
            </Button>
          </div>
          <p className="hero-note">Start with the main word. The rest of the sentence will tell you what depends on it.</p>
        </div>

        <Card className="concept-card">
          <CardHeader>
            <div className="concept-card-heading">
              <span className="concept-icon" aria-hidden="true"><BookOpen size={19} /></span>
              <div>
                <CardTitle>Today’s idea</CardTitle>
                <p className="card-kicker">Lesson 1 · {lesson.title}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="concept-copy">Every sentence has a center. Words connect to that center or to another word that explains it.</p>
            <div className="mini-rule" aria-hidden="true"><span /><span /><span /></div>
            <p className="concept-example"><strong>{sentence.text}</strong></p>
          </CardContent>
        </Card>
      </section>

      <section className="workspace-section" aria-labelledby="preview-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A sentence, unpacked</p>
            <h2 id="preview-heading">{sentence.text}</h2>
          </div>
          <p>Tap a word or curved line to inspect its role.</p>
        </div>
        <DependencyDiagram sentence={sentence} />
      </section>

      <section className="feature-grid" aria-label="Learning modes">
        <Card>
          <CardHeader><CardTitle>Explore</CardTitle></CardHeader>
          <CardContent><p>Read a completed map and follow each word’s relationship.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Build</CardTitle></CardHeader>
          <CardContent><p>Choose the head, then name the connection. One decision at a time.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Understand</CardTitle></CardHeader>
          <CardContent><p>Get feedback that explains why a word belongs where it does.</p></CardContent>
        </Card>
      </section>
    </main>
  );
}
