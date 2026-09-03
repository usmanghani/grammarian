import Link from "next/link";
import { ArrowLeft, Network } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="site-shell status-shell"><header className="topbar"><Link href="/" className="brand" aria-label="Sentence Lab home"><span className="brand-mark" aria-hidden="true"><Network size={19} /></span><span>Sentence Lab</span></Link></header><section className="status-card"><p className="eyebrow">Page not found</p><h1>That sentence is not in this lesson.</h1><p>Return to the lesson list and choose one of the reviewed examples.</p><Button asChild><Link href="/"><ArrowLeft size={16} /> Back home</Link></Button></section></main>;
}
