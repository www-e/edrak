"use client";

import { useEffect } from "react";

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

  // Add anti-screenshot and anti-screen recording measures using CSS and event listeners
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .youtube-video-container {
        position: relative;
      }
      .youtube-video-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.01);
        z-index: 9999;
        pointer-events: none;
      }
      .youtube-controls {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: relative;
        z-index: 10000;
      }
    `;
    document.head.appendChild(style);

    // Add event listeners to prevent context menu and screenshot-related events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common screenshot keys (Print Screen, Alt+Print Screen, etc.)
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu on iframe area
      const target = e.target as HTMLElement;
      if (target.closest('.youtube-video-container')) {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e: Event) => {
      // Prevent text selection
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

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
    <div className={`aspect-video youtube-video-container ${className}`}>
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