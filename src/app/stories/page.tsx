import Link from "next/link";
import { formatDate, getImageUrl, getPosts } from "@/lib/sanity";

export default async function StoriesPage() {
  const posts = await getPosts();

  return (
    <main className="archive-page">
      <header className="archive-header">
        <Link className="back-link" href="/">
          ← Field Notes
        </Link>
        <p className="eyebrow">The journal</p>
        <h1>All stories</h1>
      </header>

      <section className="archive-grid" aria-label="All stories">
        {posts.map((post) => {
          const coverImageUrl = getImageUrl(post.coverImage, 700, 440);
          const storyHref = `/stories/${post.slug?.current || ""}`;

          return (
            <article className="archive-card" key={post._id}>
              <Link href={storyHref} className={`archive-art ${coverImageUrl ? "has-image" : ""}`} aria-label={`Open ${post.title}`}>
                {coverImageUrl ? <img src={coverImageUrl} alt={post.title} className="archive-image" /> : null}
                <span>{post.category || "Field note"}</span>
              </Link>
              <p className="story-meta">
                {post.category || "Field note"} <i /> {post.readTime || 6} min read
              </p>
              <h2>
                <Link href={storyHref}>{post.title}</Link>
              </h2>
              <p className="story-date">{formatDate(post.publishedAt)}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
