import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/lib/sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a href={href} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageSource = value?.asset;
      if (!imageSource) return null;

      const src = urlFor(imageSource).width(1100).fit("max").url();
      const alt = value.alt || "Embedded article image";

      return (
        <figure className="portable-figure">
          <img src={src} alt={alt} className="portable-image" />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
};

type PortableTextRendererProps = {
  value?: PortableTextBlock[];
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;

  return <PortableText value={value} components={components} />;
}
