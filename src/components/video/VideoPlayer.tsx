import { useEffect, useRef } from 'react';

import shaka from 'shaka-player/dist/shaka-player.compiled';

interface VideoPlayerProps {
  streamUrl: string;
  licenseServer?: string;
}

export default function VideoPlayer({ streamUrl, licenseServer }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

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

      player
        .load(streamUrl)
        .then(function() {
          if (!isMounted || !videoRef.current) {
            return;
          }
          videoRef.current.play().catch(function() {
          });
        })
        .catch(function() {
        });

      return function() {
        isMounted = false;
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
