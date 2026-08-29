import { getEmbedUrl } from "@/lib/drive";

type GoogleDriveVideoProps = {
  videoUrl?: string | null;
  title?: string;
};

export function GoogleDriveVideo({ videoUrl, title = "Embedded video" }: GoogleDriveVideoProps) {
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return null;
  }
  return (
    <div className="drive-video-wrap" aria-label={title}>
      <iframe
        className="drive-video"
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
