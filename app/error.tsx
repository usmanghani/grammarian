"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* Keep the error boundary intentionally quiet for student privacy. */ }, []);
  return <main className="site-shell status-shell"><section className="status-card"><p className="eyebrow"><AlertTriangle size={15} /> Something went wrong</p><h1>The lesson could not load.</h1><p>Your local progress is safe. Try the page again or return home.</p><div className="practice-actions"><Button type="button" onClick={reset}><RotateCcw size={16} /> Try again</Button><Button asChild variant="outline"><Link href="/">Back home</Link></Button></div></section></main>;
}
