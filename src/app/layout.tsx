import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fieldnotes.example"),
  title: { default: "Field Notes | Make room for better thinking", template: "%s | Field Notes" },
  description: "Essays on attention, creative work, and the places that help us see things differently.",
  openGraph: { type: "website", siteName: "Field Notes", title: "Field Notes | Make room for better thinking", description: "A journal for curious minds." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
