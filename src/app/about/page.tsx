import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="archive-header">
        <Link className="back-link" href="/">
          ← Field Notes
        </Link>
        <p className="eyebrow">About</p>
        <h1>Thoughtful writing for slower days.</h1>
      </header>

      <section className="about-content">
        <p>
          Field Notes is a journal for curious minds who want a little more room to think, make, and notice.
          We publish essays on attention, craft, creative work, and the rituals that help us live more intentionally.
        </p>
        <p>
          We believe good thinking needs space. This publication is built for people who are tired of noise,
          constant urgency, and shallow signals — and who want deeper attention instead.
        </p>
        <div className="about-cards">
          <div>
            <span className="eyebrow">Focus</span>
            <h2>Attention</h2>
            <p>Writing and reflection that helps you slow down and pay attention to what matters.</p>
          </div>
          <div>
            <span className="eyebrow">Practice</span>
            <h2>Craft</h2>
            <p>Notes on making work, creative process, and the value of building with care.</p>
          </div>
          <div>
            <span className="eyebrow">Life</span>
            <h2>Rhythm</h2>
            <p>Thoughts on pace, place, and the routines that restore clarity instead of draining it.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
