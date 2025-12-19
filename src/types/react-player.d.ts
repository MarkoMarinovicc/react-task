declare module 'react-player' {
  import { Component } from 'react';

  export interface ReactPlayerProps {
    src?: string | string[];
    playing?: boolean;
    preload?: string;
    playsInline?: boolean;
    disableRemotePlayback?: boolean;
    crossOrigin?: string;
    loop?: boolean;
    controls?: boolean;
    volume?: number | null;
    muted?: boolean;
    playbackRate?: number;
    pip?: boolean;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    light?: boolean | string;
    fallback?: React.ReactNode;
    wrapper?: React.ComponentType<any>;
    playIcon?: React.ReactNode;
    previewTabIndex?: number;
    config?: {
      youtube?: {
        [key: string]: any;
      };
      vimeo?: {
        [key: string]: any;
      };
      file?: {
        attributes?: {
          [key: string]: any;
        };
        dashjsOptions?: {
          drm?: {
            servers?: {
              [key: string]: string;
            };
          };
          [key: string]: any;
        };
        hlsOptions?: {
          [key: string]: any;
        };
        [key: string]: any;
      };
      [key: string]: any;
    };
    onClickPreview?: () => void;
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPlaying?: () => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onTimeUpdate?: (state: { played: number; playedSeconds: number }) => void;
    onDurationChange?: (duration: number) => void;
    onPause?: () => void;
    onWaiting?: () => void;
    onSeeking?: () => void;
    onSeeked?: () => void;
    onRateChange?: () => void;
    onEnded?: () => void;
    onError?: (error: any) => void;
    onEnterPictureInPicture?: () => void;
    onLeavePictureInPicture?: () => void;
  }

  export default class ReactPlayer extends Component<ReactPlayerProps> {
    static canPlay(src: string): boolean;
    static addCustomPlayer(CustomPlayer: any): void;
    static removeCustomPlayers(): void;
  }
}

