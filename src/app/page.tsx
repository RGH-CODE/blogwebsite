import Link from "next/link";
import { formatDate, getImageUrl, getPosts } from "@/lib/sanity";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ContactForm } from "@/components/ContactForm";

const toneMap = ["sage", "amber", "blue"] as const;

export default async function Home() {
  const posts = await getPosts();
  const [featured, ...latest] = posts;
  const featuredImageUrl = featured ? getImageUrl(featured.coverImage, 1200, 800) : null;

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/">
          field<span>notes</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/stories">Stories</Link>
          <Link href="/studio">Studio <span className="nav-dot" /></Link>
        </nav>
      </header>

      <main>
        <section className="intro-band">
          <div>
            <h2>This blog page is under maintance and testing phase!!</h2>
            <p>The below blogs might not be real!!</p>
            <p>we can explore site and leave feedback below</p>
            <p className="eyebrow">An independent journal for curious minds</p>
            <h1>
              Make room<br />
              <em>for better</em> thinking.
            </h1>
          </div>
          <div className="intro-aside">
            <p>Essays on attention, creative work, and the places that help us see things differently.</p>
            <a className="text-link" href="#latest">
              Explore the latest <span>↓</span>
            </a>
          </div>
        </section>

        {featured ? (
          <section className="featured-grid" aria-labelledby="featured-heading">
            <Link href={`/stories/${featured.slug?.current || ""}`} className={`feature-art ${featuredImageUrl ? "has-image" : ""}`} aria-label={`Open ${featured.title}`}>
              {featuredImageUrl ? (
                <img src={featuredImageUrl} alt={featured.title} className="feature-image" />
              ) : (
                <>
                  <div className="sun" />
                  <div className="ridge ridge-back" />
                  <div className="ridge ridge-front" />
                </>
              )}
              <span className="art-label">01 / {featured.category || "Field note"}</span>
            </Link>
            <article className="feature-copy">
              <p className="eyebrow">
                Featured essay · {featured.readTime || 6} min read
              </p>
              <h2 id="featured-heading">{featured.title}</h2>
              <p className="dek">{featured.excerpt || "A thoughtful reflection from the journal."}</p>
              <div className="byline">
                <span className="avatar">{featured.author?.name?.slice(0, 2).toUpperCase() || "AM"}</span>
                <span>
                  By {featured.author?.name || "Ada Morrow"}
                  <br />
                  <small>{formatDate(featured.publishedAt)}</small>
                </span>
              </div>
              <Link className="button button-dark" href={`/stories/${featured.slug?.current || ""}`}>
                Read the story <span>↗</span>
              </Link>
            </article>
          </section>
        ) : null}

        <section className="latest" id="latest" aria-labelledby="latest-heading">
          <div className="section-heading">
            <p className="eyebrow">The journal</p>
            <h2 id="latest-heading">Latest stories</h2>
            <Link className="text-link" href="/stories">
              View all <span>→</span>
            </Link>
          </div>
          <div className="story-grid">
            {latest.map((story, index) => {
              const storyImageUrl = getImageUrl(story.coverImage, 700, 460);
              const storyHref = `/stories/${story.slug?.current || ""}`;

              return (
                <article className="story-card" key={story._id}>
                  <Link href={storyHref} className={`story-art ${toneMap[index % toneMap.length]} ${storyImageUrl ? "has-image" : ""}`} aria-label={`Open ${story.title}`}>
                    {storyImageUrl ? (
                      <img src={storyImageUrl} alt={story.title} className="story-image" />
                    ) : null}
                    <span>{String(index + 2).padStart(2, "0")}</span>
                  </Link>
                  <p className="story-meta">
                    {story.category || "Field note"} <i /> {story.readTime || 6} min read
                  </p>
                  <h3>
                    <Link href={storyHref}>{story.title}</Link>
                  </h3>
                  <p className="story-date">{formatDate(story.publishedAt)}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <p className="eyebrow">The Sunday letter</p>
            <h2>
              A little more room<br />
              <em>to think.</em>
            </h2>
          </div>
          <div>
            <p>A thoughtful note on making, noticing, and finding a pace that feels like your own. No noise. Once a week.</p>
            <NewsletterSignup />
          </div>
        </section>

        <section className="contact-section" aria-labelledby="contact-heading">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Let’s talk</p>
            <h2 id="contact-heading">Ask about a writing project</h2>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="wordmark">
            field<span>notes</span>
          </span>
          <p>Essays on attention, craft, and a more intentional life.</p>
        </div>

        <div className="footer-links">
          <div>
            <span className="footer-label">Explore</span>
            <Link href="/stories">Stories</Link>
            <Link href="/">Journal</Link>
          </div>
          <div>
            <span className="footer-label">Company</span>
            <Link href="/studio">Studio</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        <div className="footer-meta">
          <span>© 2026 Field Notes Journal</span>
          <Link href="/studio">Open studio →</Link>
        </div>
      </footer>
    </div>
  );
}
