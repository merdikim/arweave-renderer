import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import useVideo from "../hooks/useVideo";
import { cn } from "../lib/utils";
import type { TComponentProps } from "../types";
import {
  Loader,
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  TriangleAlert,
  Volume2,
  VolumeX,
} from "lucide-react";

const Video = ({ id, className }: TComponentProps) => {
  const { data, isVideoLoading, isVideoError, error } = useVideo(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null); // Reference to the filled portion
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const video = videoRef.current;
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    
    // Calculate the click position relative to the progress bar
    const clickX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const percent = Math.max(0, Math.min(1, clickX / progressBarWidth));
    const newTime = percent * duration;
    
    if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleProgressClick(e);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse events on document for dragging
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !videoRef.current || !progressRef.current) return;
      
      const video = videoRef.current;
      const progressBar = progressRef.current;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const percent = Math.max(0, Math.min(1, clickX / progressBarWidth));
      const newTime = percent * duration;
      
      if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
        video.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
    video.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage with safety checks
  const progressPercent = useMemo(() => {
    if (!duration || duration === 0 || !isFinite(duration)) return 0;
    if (!currentTime || !isFinite(currentTime)) return 0;
    return Math.max(0, Math.min(100, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const newTime = video.currentTime;
      if (isFinite(newTime)) {
        setCurrentTime(newTime);
      }
    };
    
    const updateDuration = () => {
      const newDuration = video.duration;
      if (isFinite(newDuration) && newDuration > 0) {
        setDuration(newDuration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    const handleLoadedData = () => {
      updateDuration();
      updateTime();
    };

    const handleCanPlay = () => {
      updateDuration();
      updateTime();
    };

    // Add event listeners
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    // Initial setup
    if (video.readyState >= 1) {
      updateDuration();
      updateTime();
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [data?.url]);

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (isVideoLoading) {
    return (
      <VideoWrapper className={className}>
        <div className="flex flex-col items-center justify-center m-2"><Loader className="animate-spin m-2" /></div>
      </VideoWrapper>
    );
  }

  if (isVideoError) {
    return (
      <VideoWrapper className={className}>
        <div className="flex flex-col items-center justify-center m-2">
          <TriangleAlert />
          {error?.message}
        </div>
      </VideoWrapper>
    );
  }

  return (
    <VideoWrapper className={className}>
      {/* Debug info */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        <div>Duration: {formatTime(duration)}</div>
        <div>Current: {formatTime(currentTime)}</div>
        <div>Progress: {progressPercent.toFixed(1)}%</div>
        <div>Ready State: {videoRef.current?.readyState}</div>
      </div>

      {/* Video Element */}
      <div
        className="relative group h-full min-w-[350px]"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          onClick={togglePlay}
          src={data?.url}
          preload="metadata"
          crossOrigin="anonymous"
        />

        {/* Custom Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div
              ref={progressRef}
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer group/progress relative"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
              onMouseMove={handleProgressMouseMove}
              onMouseUp={handleProgressMouseUp}
            >
              {/* Background track */}
              <div className="absolute inset-0 rounded-full bg-white/20"></div>
              
              {/* Progress fill */}
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative transition-all duration-200 group-hover/progress:h-3"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Progress handle */}
                <div 
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-opacity duration-200 ${
                    isDragging ? 'opacity-100' : 'opacity-0 group-hover/progress:opacity-100'
                  }`}
                ></div>
              </div>

              {/* Hover preview (optional) */}
              <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white rounded-full transition-opacity duration-200"></div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skipTime(-10)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <RotateCw className="w-5 h-5 text-white" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-blue-400 transition-colors duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Time Display */}
              <div className="text-white hidden md:block text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-blue-400 transition-colors duration-200"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="h-14 w-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Play className="h-7 w-7 sm:w-10 sm:h-10 text-white" />
            </button>
          </div>
        )}
      </div>
    </VideoWrapper>
  );
};


const VideoWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) => {
  return (
    <div
      className={cn(
        "relative min-h-[250px] min-w-[250px] max-w-4xl mx-auto flex items-center justify-center border text-black border-gray-200 rounded-sm dark:text-white dark:border-gray-900 overflow-hidden",  
        className,
        //"h-auto" //force height auto to avoid video distortion
      )}
    >
      {children}
    </div>
  );
};

export default Video;
