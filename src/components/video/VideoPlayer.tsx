import { useEffect, useRef } from 'react';

import shaka from 'shaka-player/dist/shaka-player.compiled';

interface VideoPlayerProps {
  streamUrl: string;
  licenseServer?: string;
}

export default function VideoPlayer({ streamUrl, licenseServer }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const lastProgressRef = useRef<number>(0);
  const stallIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef<number>(0);

  useEffect(function() {
    if (!videoRef.current) {
      return;
    }
    if (!streamUrl) {
      if (playerRef.current) {
        playerRef.current.destroy().catch(function() {
        });
        playerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    shaka.polyfill.installAll();


    if (shaka.Player.isBrowserSupported()) {
      if (playerRef.current) {
        playerRef.current.destroy().catch(function() {
        });
        playerRef.current = null;
      }

      const player = new shaka.Player(videoRef.current);
      playerRef.current = player;

      player.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
        },
      });

      if (licenseServer) {
        player.configure({
          drm: {
            servers: {
              'com.widevine.alpha': licenseServer,
            },
          },
        });
      }

      const scheduleRecovery = function(reason: string) {
        if (retryTimerRef.current) {
          return;
        }
        const attempt = retryCountRef.current + 1;
        const delay = Math.min(3000 * Math.pow(2, retryCountRef.current), 30000); // exp backoff cap 30s
        if (attempt > 5) {
          console.warn('[VideoPlayer] Recovery stopped after max attempts. Reason:', reason);
          // give up for this load; leave player idle
          return;
        }
        console.warn('[VideoPlayer] Scheduling recovery', { reason: reason, attempt: attempt, delay: delay });
        retryTimerRef.current = setTimeout(function() {
          retryTimerRef.current = null;
          retryCountRef.current = attempt;
          if (!playerRef.current) {
            return;
          }
          playerRef.current.load(streamUrl).catch(function() {
            console.error('[VideoPlayer] Recovery load failed', { attempt: attempt, reason: reason });
          });
        }, delay);
      };

      const attachWatchdog = function() {
        lastProgressRef.current = Date.now();
        const onTimeUpdate = function() {
          lastProgressRef.current = Date.now();
        };
        videoRef.current?.addEventListener('timeupdate', onTimeUpdate);

        stallIntervalRef.current = setInterval(function() {
          const videoEl = videoRef.current;
          if (!videoEl) {
            return;
          }
          const isPlaying = !videoEl.paused && !videoEl.ended && videoEl.readyState >= 2;
          const stalled = Date.now() - lastProgressRef.current > 8000;
          if (isPlaying && stalled) {
            console.warn('[VideoPlayer] Detected stall, attempting recovery');
            scheduleRecovery('stall');
            videoEl.play().catch(function() {
            });
          }
        }, 4000);

        return function() {
          if (stallIntervalRef.current) {
            clearInterval(stallIntervalRef.current);
            stallIntervalRef.current = null;
          }
          videoRef.current?.removeEventListener('timeupdate', onTimeUpdate);
        };
      };

      const detachWatchdog = attachWatchdog();

      player.addEventListener('error', function() {
        console.error('[VideoPlayer] Shaka error event');
        scheduleRecovery('shaka-error');
      });

      player
        .load(streamUrl)
        .then(function() {
          if (!isMounted || !videoRef.current) {
            return;
          }
          videoRef.current.play().catch(function() {
          });
          lastProgressRef.current = Date.now();
          retryCountRef.current = 0; // reset on success
          console.info('[VideoPlayer] Stream load success, retries reset');
        })
        .catch(function() {
          console.error('[VideoPlayer] Initial load failed');
        });

      return function() {
        isMounted = false;
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        if (stallIntervalRef.current) {
          clearInterval(stallIntervalRef.current);
          stallIntervalRef.current = null;
        }
        if (detachWatchdog) {
          detachWatchdog();
        }
        if (playerRef.current) {
          playerRef.current.destroy().catch(function() {
          });
          playerRef.current = null;
        }
      };
    }
  }, [streamUrl, licenseServer]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
    </div>
  );
}
