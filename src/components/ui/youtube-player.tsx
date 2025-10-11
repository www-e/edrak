"use client";

interface YouTubePlayerProps {
  url: string;
  title: string;
  className?: string;
}

/**
 * YouTube Player Component - Zero Vercel Bandwidth
 *
 * This component embeds YouTube videos directly using YouTube's iframe player.
 * All video content is streamed directly from YouTube's CDN, ensuring zero
 * bandwidth costs on Vercel servers.
 */
export function YouTubePlayer({ url, title, className = "" }: YouTubePlayerProps) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <p className="font-medium">Invalid YouTube URL</p>
          <p className="text-sm">Please check the video URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}