import Link from "next/link";

const stories = [
  { category: "Field note", title: "The quiet power of a well-made morning", date: "Aug 18, 2026", read: "6 min read", slug: "quiet-power-of-a-well-made-morning", tone: "sage" },
  { category: "Working life", title: "A slower way to make better decisions", date: "Aug 11, 2026", read: "8 min read", slug: "slower-way-to-make-better-decisions", tone: "amber" },
  { category: "Places", title: "What the coast teaches us about attention", date: "Aug 04, 2026", read: "5 min read", slug: "what-the-coast-teaches-us-about-attention", tone: "blue" },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header"><Link className="wordmark" href="/">field<span>notes</span></Link><nav aria-label="Primary navigation"><Link href="/">Stories</Link><Link href="/studio">Studio <span className="nav-dot" /></Link></nav></header>
      <main>
        <section className="intro-band"><div><p className="eyebrow">An independent journal for curious minds</p><h1>Make room<br /><em>for better</em> thinking.</h1></div><div className="intro-aside"><p>Essays on attention, creative work, and the places that help us see things differently.</p><a className="text-link" href="#latest">Explore the latest <span>↓</span></a></div></section>
        <section className="featured-grid" aria-labelledby="featured-heading"><div className="feature-art" aria-label="Abstract illustration of a morning landscape"><div className="sun" /><div className="ridge ridge-back" /><div className="ridge ridge-front" /><span className="art-label">01 / Field note</span></div><article className="feature-copy"><p className="eyebrow">Featured essay · 6 min read</p><h2 id="featured-heading">The quiet power of a well-made morning</h2><p className="dek">Before the day asks anything of us, there is a small window where attention is still our own. A field guide to protecting it.</p><div className="byline"><span className="avatar">AM</span><span>By Ada Morrow<br /><small>Aug 18, 2026</small></span></div><Link className="button button-dark" href="/stories/quiet-power-of-a-well-made-morning">Read the story <span>↗</span></Link></article></section>
        <section className="latest" id="latest" aria-labelledby="latest-heading"><div className="section-heading"><p className="eyebrow">The journal</p><h2 id="latest-heading">Latest stories</h2><Link className="text-link" href="/">View all <span>→</span></Link></div><div className="story-grid">{stories.map((story, index) => <article className="story-card" key={story.slug}><div className={`story-art ${story.tone}`}><span>0{index + 2}</span></div><p className="story-meta">{story.category} <i /> {story.read}</p><h3><Link href={`/stories/${story.slug}`}>{story.title}</Link></h3><p className="story-date">{story.date}</p></article>)}</div></section>
        <section className="newsletter"><div><p className="eyebrow">The Sunday letter</p><h2>A little more room<br /><em>to think.</em></h2></div><div><p>A thoughtful note on making, noticing, and finding a pace that feels like your own. No noise. Once a week.</p><form><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" placeholder="Your email address" /><button type="submit">Join the list <span>→</span></button></form></div></section>
      </main>
      <footer><span className="wordmark">field<span>notes</span></span><span>© 2026 Field Notes Journal</span><Link href="/studio">Open studio →</Link></footer>
    </div>
  );
}
