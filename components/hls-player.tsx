"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";

interface Subtitle {
  url: string;
  lang: string;
}

interface SourceInfo {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

interface HlsPlayerProps {
  sources: SourceInfo[];
  subtitles?: Subtitle[];
  headers?: Record<string, string>;
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  onTryNext?: () => void;
  hasNextServer?: boolean;
  autoPlay?: boolean;
}

interface QualityLevel {
  index: number;
  height: number;
  label: string;
}

export function HlsPlayer({
  sources,
  subtitles = [],
  headers,
  intro,
  outro,
  onTryNext,
  hasNextServer,
  autoPlay = true,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(-1);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hlsSource = sources.find((s) => s.isM3U8) || sources[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsSource) return;

    setError(null);
    setIsLoading(true);

    if (hlsSource.isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        ...(headers && {
          xhrSetup(xhr: XMLHttpRequest) {
            for (const [key, val] of Object.entries(headers)) {
              if (key.toLowerCase() !== "referer") {
                xhr.setRequestHeader(key, val);
              }
            }
          },
        }),
      });

      hls.loadSource(hlsSource.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        const levels: QualityLevel[] = data.levels.map((level, i) => ({
          index: i,
          height: level.height,
          label: `${level.height}p`,
        }));
        setQualities(levels);
        setCurrentQuality(-1);
        setIsLoading(false);
        if (autoPlay) video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setError("Playback error. Try another server.");
          }
        }
      });

      hlsRef.current = hls;
      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsSource.url;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (autoPlay) video.play().catch(() => {});
      });
    } else if (!hlsSource.isM3U8) {
      video.src = hlsSource.url;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (autoPlay) video.play().catch(() => {});
      });
    } else {
      setError("HLS is not supported in this browser.");
    }
  }, [hlsSource?.url, headers, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const buf = video.buffered;
      if (buf.length > 0) {
        setBuffered(buf.end(buf.length - 1));
      }
    };
    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  useEffect(() => {
    if (intro) {
      setShowSkipIntro(currentTime >= intro.start && currentTime < intro.end);
    }
    if (outro) {
      setShowSkipOutro(currentTime >= outro.start && currentTime < outro.end);
    }
  }, [currentTime, intro, outro]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      clearTimeout(hideTimerRef.current);
    } else {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(hideTimerRef.current);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = time;
  }, []);

  const changeVolume = useCallback((v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  const setQuality = useCallback(
    (levelIndex: number) => {
      const hls = hlsRef.current;
      if (hls) {
        hls.currentLevel = levelIndex;
        setCurrentQuality(levelIndex);
      }
      setShowQualityMenu(false);
    },
    []
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;
      const pct = (e.clientX - rect.left) / rect.width;
      seek(pct * duration);
    },
    [duration, seek]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(Math.max(0, currentTime - 10));
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(Math.min(duration, currentTime + 10));
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
      resetHideTimer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seek, changeVolume, toggleMute, toggleFullscreen, currentTime, duration, volume, resetHideTimer]);

  function formatTime(s: number) {
    if (!isFinite(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 flex flex-col items-center justify-center gap-4">
        <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-zinc-400">{error}</p>
        {hasNextServer && onTryNext && (
          <button
            onClick={onTryNext}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2 text-sm font-medium text-white transition-colors"
          >
            Try Next Server
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl shadow-black/50 group select-none"
      onMouseMove={resetHideTimer}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, [data-menu]")) return;
        togglePlay();
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        playsInline
        crossOrigin="anonymous"
      >
        {subtitles.map((sub, i) => (
          <track
            key={i}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang.slice(0, 2).toLowerCase()}
            label={sub.lang}
            default={i === selectedSubtitle}
          />
        ))}
      </video>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="h-12 w-12 border-4 border-white/20 border-t-violet-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Skip intro button */}
      {showSkipIntro && (
        <button
          onClick={(e) => { e.stopPropagation(); seek(intro!.end); }}
          className="absolute bottom-24 right-6 z-20 rounded-lg bg-white/90 text-black px-5 py-2 text-sm font-semibold shadow-lg hover:bg-white transition-colors"
        >
          Skip Intro
        </button>
      )}

      {/* Skip outro button */}
      {showSkipOutro && (
        <button
          onClick={(e) => { e.stopPropagation(); seek(outro!.end); }}
          className="absolute bottom-24 right-6 z-20 rounded-lg bg-white/90 text-black px-5 py-2 text-sm font-semibold shadow-lg hover:bg-white transition-colors"
        >
          Skip Outro
        </button>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 px-4 pb-4 space-y-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2.5 transition-all"
            onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
          >
            <div
              className="h-full bg-white/30 rounded-full absolute left-0 top-0"
              style={{ width: duration ? `${(buffered / duration) * 100}%` : "0%" }}
            />
            <div
              className="h-full bg-violet-500 rounded-full relative"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="text-white hover:text-violet-400 transition-colors"
            >
              {isPlaying ? (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="text-white hover:text-violet-400 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6.253v11.494m0-11.494L7.293 10.96H4.293a1 1 0 00-1 1v.08a1 1 0 001 1h2.999L12 17.747m0-11.494a4.978 4.978 0 013.536 1.464M18.364 5.636a9 9 0 010 12.728" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => { e.stopPropagation(); changeVolume(Number(e.target.value)); }}
                onClick={(e) => e.stopPropagation()}
                className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-violet-500 h-1 cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-xs text-white/80 font-mono tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Subtitles */}
            {subtitles.length > 0 && (
              <div className="relative" data-menu>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubMenu(!showSubMenu);
                    setShowQualityMenu(false);
                  }}
                  className={`text-white hover:text-violet-400 transition-colors ${selectedSubtitle >= 0 ? "text-violet-400" : ""}`}
                  title="Subtitles"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </button>
                {showSubMenu && (
                  <div
                    className="absolute bottom-full right-0 mb-2 min-w-[160px] rounded-xl bg-zinc-900/95 backdrop-blur border border-white/10 py-1.5 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setSelectedSubtitle(-1);
                        setShowSubMenu(false);
                        const video = videoRef.current;
                        if (video) {
                          for (let i = 0; i < video.textTracks.length; i++) {
                            video.textTracks[i].mode = "disabled";
                          }
                        }
                      }}
                      className={`w-full text-left px-4 py-1.5 text-xs transition-colors ${
                        selectedSubtitle === -1 ? "text-violet-400 bg-violet-500/10" : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      Off
                    </button>
                    {subtitles.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedSubtitle(i);
                          setShowSubMenu(false);
                          const video = videoRef.current;
                          if (video) {
                            for (let j = 0; j < video.textTracks.length; j++) {
                              video.textTracks[j].mode = j === i ? "showing" : "disabled";
                            }
                          }
                        }}
                        className={`w-full text-left px-4 py-1.5 text-xs transition-colors ${
                          selectedSubtitle === i ? "text-violet-400 bg-violet-500/10" : "text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        {sub.lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quality */}
            {qualities.length > 1 && (
              <div className="relative" data-menu>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQualityMenu(!showQualityMenu);
                    setShowSubMenu(false);
                  }}
                  className="text-white hover:text-violet-400 transition-colors"
                  title="Quality"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {showQualityMenu && (
                  <div
                    className="absolute bottom-full right-0 mb-2 min-w-[120px] rounded-xl bg-zinc-900/95 backdrop-blur border border-white/10 py-1.5 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setQuality(-1)}
                      className={`w-full text-left px-4 py-1.5 text-xs transition-colors ${
                        currentQuality === -1 ? "text-violet-400 bg-violet-500/10" : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      Auto
                    </button>
                    {qualities
                      .sort((a, b) => b.height - a.height)
                      .map((q) => (
                        <button
                          key={q.index}
                          onClick={() => setQuality(q.index)}
                          className={`w-full text-left px-4 py-1.5 text-xs transition-colors ${
                            currentQuality === q.index ? "text-violet-400 bg-violet-500/10" : "text-zinc-300 hover:bg-white/5"
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="text-white hover:text-violet-400 transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Big play button when paused */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-violet-600/80 backdrop-blur flex items-center justify-center">
            <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
