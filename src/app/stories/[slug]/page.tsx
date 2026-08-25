import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The quiet power of a well-made morning",
  description: "Before the day asks anything of us, there is a small window where attention is still our own.",
};

export default async function StoryPage() {
  const title = "The quiet power of a well-made morning";
  return <main className="story-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: title, datePublished: "2026-08-18", author: { "@type": "Person", name: "Ada Morrow" }, publisher: { "@type": "Organization", name: "Field Notes" } }) }} /><Link className="back-link" href="/">← Field Notes</Link><p className="eyebrow">Field note · Aug 18, 2026 · 6 min read</p><h1>The quiet power<br /><em>of a well-made morning</em></h1><p className="article-lead">Before the day asks anything of us, there is a small window where attention is still our own.</p><div className="article-art"><div className="sun" /><div className="ridge ridge-back" /><div className="ridge ridge-front" /></div><article><p>There is a particular kind of quiet that belongs only to the first hour. It is not silence exactly, but the absence of being needed. The day has not yet arranged itself around requests.</p><p>We often treat mornings as a runway, a place to accelerate from sleep into usefulness. But a morning can be something else: a small room we build for ourselves, with the windows open.</p><h2>Begin with what is already here</h2><p>The ritual need not be elaborate. A cup made slowly. A walk without a destination. Five pages of a book before the small blue rectangle gets its say. The point is not optimization. It is recognition.</p><p>Attention is a finite, tender thing. Give some of it back to yourself before the world starts spending it.</p></article><Link className="button button-dark" href="/">Back to the journal <span>↗</span></Link></main>;
}