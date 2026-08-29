export function getEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);

    // YouTube watch URL
    if (
      url.hostname.includes("youtube.com") &&
      url.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
    }

    // YouTube Shorts
    if (
      url.hostname.includes("youtube.com") &&
      url.pathname.startsWith("/shorts/")
    ) {
      const id = url.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtu.be URL
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    // Google Drive
    if (url.pathname.includes("/file/d/")) {
      const match = url.pathname.match(/\/file\/d\/([^/]+)/i);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    const driveId = url.searchParams.get("id");
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
  } catch {
    return null;
  }

  return null;
}