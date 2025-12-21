export interface StreamSource {
  id: string;
  name: string;
  url: string;
  licenseServer?: string;
}

export const STREAM_SOURCES: StreamSource[] = [
  {
    id: 'angel-one',
    name: 'Angel One',
    url: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  },
  {
    id: 'tears-of-steel',
    name: 'Tears of Steel',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  },
  {
    id: 'big-buck-bunny',
    name: 'Big Buck Bunny',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  },
];

