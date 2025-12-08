"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export interface VideoPlayerHandle {
  getCurrentTime: () => number;
  getDuration: () => number;
  formatTime: (seconds: number) => string;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({
  src,
  title,
  className = ""
}, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Expose video player methods to parent
  useImperativeHandle(ref, () => ({
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
    formatTime: (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.floor(seconds % 60);
      return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
    },
  } as VideoPlayerHandle), []);

  // Update current time when video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', updateTime);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
  };

  // Add anti-screenshot and anti-screen recording CSS styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      video {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-pointer-events: none;
        pointer-events: none;
      }
      .video-controls {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .video-content {
        position: relative;
      }
      .video-content::before {
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
      // Prevent context menu on video area
      if (videoRef.current?.contains(e.target as Node)) {
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

  // Handle video loading with performance optimizations
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      let errorMessage = "Failed to load video. ";

      if (videoElement.error) {
        switch (videoElement.error.code) {
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage += "Network error. Please check your internet connection.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage += "Video format not supported or corrupted.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage += "Video format not supported by your browser.";
            break;
          default:
            errorMessage += "Please try again or contact support.";
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Unmute: restore previous volume
      video.muted = false;
      video.volume = volume;
    } else {
      // Mute: set volume to 0 and remember current volume
      video.muted = true;
    }
    setIsMuted(!isMuted);
  };


  if (error) {
    return (
      <Card className={`aspect-video ${className}`}>
        <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden group ${className}`}>
      <div className="video-content">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain bg-black"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => {
            const newVolume = e.currentTarget.volume;
            setVolume(newVolume);
            // Update muted state based on volume
            if (newVolume === 0 && !isMuted) {
              setIsMuted(true);
            } else if (newVolume > 0 && isMuted) {
              setIsMuted(false);
            }
          }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          preload="metadata"
          playsInline
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}

      {/* Video controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls || isPlaying ? 'opacity-100' : 'opacity-0'
      } video-controls`}>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={togglePlay}
              disabled={isLoading}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Title overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
    </Card>
  );
});

VideoPlayer.displayName = "VideoPlayer";