import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export type Post = {
  _id: string;
  title: string;
  slug: { current: string } | null;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  readTime?: number;
  coverImage?: { asset?: { _ref?: string } } | null;
  body?: unknown[];
  videoUrl?: string | null;
  author?: {
    name?: string;
    bio?: string;
    image?: { asset?: { _ref?: string } } | null;
  } | null;
  _createdAt?: string;
};

export const fallbackPosts: Post[] = [
  {
    _id: "fallback-1",
    title: "The quiet power of a well-made morning",
    slug: { current: "quiet-power-of-a-well-made-morning" },
    excerpt: "Before the day asks anything of us, there is a small window where attention is still our own.",
    category: "Field note",
    publishedAt: "2026-08-18T09:00:00.000Z",
    readTime: 6,
    body: [],
    author: { name: "Ada Morrow", bio: "Writer and editor." },
  },
  {
    _id: "fallback-2",
    title: "A slower way to make better decisions",
    slug: { current: "slower-way-to-make-better-decisions" },
    excerpt: "Most good decisions become better when we stop rushing to become useful.",
    category: "Working life",
    publishedAt: "2026-08-11T09:00:00.000Z",
    readTime: 8,
    body: [],
    author: { name: "Ada Morrow", bio: "Writer and editor." },
  },
  {
    _id: "fallback-3",
    title: "What the coast teaches us about attention",
    slug: { current: "what-the-coast-teaches-us-about-attention" },
    excerpt: "The seaside is a reminder that some of our best attention is shaped by rhythm, not output.",
    category: "Places",
    publishedAt: "2026-08-04T09:00:00.000Z",
    readTime: 5,
    body: [],
    author: { name: "Ada Morrow", bio: "Writer and editor." },
  },
];

export const sanityClient = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion,
  useCdn: true,
  stega: false,
});

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

export function getImageUrl(source: SanityImageSource | null | undefined, width = 1200, height = 800) {
  if (!source) return null;
  return urlFor(source).width(width).height(height).fit("crop").url();
}

export function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export async function getPosts(): Promise<Post[]> {
  if (!projectId || !dataset) {
    return fallbackPosts;
  }

  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    coverImage,
    body,
    videoUrl,
    author->{
      _id,
      name,
      bio,
      image
    }
  }`;

  return sanityClient.fetch<Post[]>(query, {}, { next: { revalidate: 300 } });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!projectId || !dataset) {
    return fallbackPosts.find((post) => post.slug?.current === slug) ?? null;
  }

  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    coverImage,
    body,
    videoUrl,
    author->{
      _id,
      name,
      bio,
      image
    }
  }`;

  return sanityClient.fetch<Post | null>(query, { slug }, { next: { revalidate: 300 } });
}
