"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";

const initialTitle = "The quiet power of a well-made morning";
const initialBody = "Before the day asks anything of us, there is a small window where attention is still our own.\n\nA morning can be a small room we build for ourselves, with the windows open.";

export default function StudioPage() {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [saved, setSaved] = useState("Draft saved locally");

  useEffect(() => {
    const draft = window.localStorage.getItem("field-notes-draft");
    if (draft) { const parsed = JSON.parse(draft) as { title: string; body: string }; startTransition(() => { setTitle(parsed.title); setBody(parsed.body); }); }
  }, []);

  function saveDraft() {
    window.localStorage.setItem("field-notes-draft", JSON.stringify({ title, body }));
    setSaved("Saved just now");
  }

  return <main className="studio-page"><header className="studio-header"><Link className="wordmark" href="/">field<span>notes</span></Link><Link className="back-link" href="/">← View publication</Link></header><div className="studio-intro"><p className="eyebrow">Private studio</p><h1>Make something<br /><em>worth reading.</em></h1></div><section className="editor-layout"><div className="editor"><div className="editor-toolbar"><span>New story</span><span className="status"><i /> {saved}</span></div><label htmlFor="story-title">Story title</label><input id="story-title" value={title} onChange={(event) => setTitle(event.target.value)} /><label htmlFor="story-body">Story body</label><textarea id="story-body" value={body} onChange={(event) => setBody(event.target.value)} /><div className="editor-actions"><button className="button button-dark" onClick={saveDraft}>Save draft <span>↓</span></button><button className="button button-outline" onClick={() => setSaved("Ready to publish")}>Publish story <span>↗</span></button></div></div><aside className="preview"><p className="eyebrow">Live preview</p><h2>{title || "Untitled story"}</h2><p className="preview-meta">Field note · 6 min read</p>{body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</aside></section></main>;
}