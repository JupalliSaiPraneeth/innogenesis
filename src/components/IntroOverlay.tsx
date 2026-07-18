declare module 'react';
import { useEffect, useRef, useState } from 'react';

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [videoSrc, setVideoSrc] = useState('/final.mp4');

  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const SESSION_KEY = 'nri_intro_seen_2026';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateVideoSource = () => {
      setVideoSrc(mediaQuery.matches ? '/Mobile_final.mp4' : '/final.mp4');
    };

    updateVideoSource();
    mediaQuery.addEventListener?.('change', updateVideoSource);

    return () => {
      mediaQuery.removeEventListener?.('change', updateVideoSource);
    };
  }, []);

  useEffect(() => {
    // Check if the user has already seen the intro during this browser session
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen === '1') {
      setVisible(false);
      document.body.style.overflow = '';
      return;
    }

    // Otherwise, show the intro overlay and freeze scrolling
    setVisible(true);
    document.body.style.overflow = 'hidden';

    // Show the "Skip intro" button after 2 seconds
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    document.body.style.overflow = '';

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        setVisible(false);
      }, 900); // matches transition speed
    } else {
      setVisible(false);
    }
  };

  // Standard Video playing logic
  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;
    if (!video) return;

    // Play video. Handle autoplay blocker gracefully
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked: mute video and retry
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgressWidth((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      video.pause();
      setProgressWidth(100);
      setVideoEnded(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Global click/key listeners to enter after video ends
    const handleGlobalTrigger = () => {
      if (videoEnded) {
        handleEnterSite();
      }
    };

    window.addEventListener('keydown', handleGlobalTrigger);
    window.addEventListener('click', handleGlobalTrigger);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('keydown', handleGlobalTrigger);
      window.removeEventListener('click', handleGlobalTrigger);
    };
  }, [visible, videoEnded, videoSrc]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      id="intro-overlay"
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-all duration-700 ease-out"
    >
      {/* FULLSCREEN VIDEO PLAYER */}
      <video
        key={videoSrc}
        ref={videoRef}
        id="intro-video"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* SKIP BUTTON - Visible after 2 seconds */}
      {showSkip && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggers
            handleEnterSite();
          }}
          className="absolute top-6 right-6 z-10 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/70 hover:text-amber-500 hover:border-amber-500/50 border border-white/10 text-white/70 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer backdrop-blur-md"
        >
          Skip intro ›
        </button>
      )}

      {/* DYNAMIC PROGRESS BAR AT BOTTOM */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-orange-600 via-amber-500 to-amber-300 transition-all duration-100 ease-linear" style={{ width: `${progressWidth}%` }} />

      {/* CLICK / TOUCH PROMPT WHEN VIDEO ENDS */}
      {videoEnded && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <button
            onClick={handleEnterSite}
            className="flex items-center gap-3.5 px-7 py-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-amber-500/40 cursor-pointer shadow-lg active:scale-95 transition-all group animate-bounce"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/60 animate-ping" />
            <span className="font-sans text-xs md:text-sm font-bold tracking-widest text-white/95 uppercase">
              Press any key or click to enter
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
