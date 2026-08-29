import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleDriveVideo } from "@/components/GoogleDriveVideo";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { formatDate, getImageUrl, getPostBySlug } from "@/lib/sanity";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: post?.title || "Story",
    description: post?.excerpt || "A story from Field Notes.",
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverImage = getImageUrl(post.coverImage, 1200, 800);
  const articleDate = formatDate(post.publishedAt);

  return (
    <main className="story-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.publishedAt,
            author: { "@type": "Person", name: post.author?.name || "Ada Morrow" },
            publisher: { "@type": "Organization", name: "Field Notes" },
            description: post.excerpt || "A story from Field Notes.",
          }),
        }}
      />

      <Link className="back-link" href="/">
        ← Field Notes
      </Link>

      <p className="eyebrow">
        {post.category || "Field note"} · {articleDate} · {post.readTime || 6} min read
      </p>

      <h1>{post.title}</h1>
      <p className="article-lead">{post.excerpt}</p>

      <div className={`article-art ${coverImage ? "has-image" : "placeholder"}`}>
        {coverImage ? (
          <img src={coverImage} alt={post.title} className="hero-image" />
        ) : (
          <>
            <div className="sun" />
            <div className="ridge ridge-back" />
            <div className="ridge ridge-front" />
          </>
        )}
      </div>

      {post.videoUrl ? (
        <div className="article-media">
          <GoogleDriveVideo videoUrl={post.videoUrl} title={post.title} />
        </div>
      ) : null}

      <article>
        <PortableTextRenderer value={post.body as any} />
      </article>

      <Link className="button button-dark" href="/">
        Back to the journal <span>↗</span>
      </Link>
    </main>
  );
}
