# React EPG + Video Player (ES5 target)

Simple EPG app with a background DRM/HLS player (Shaka), tuned for legacy Chromium 20–30 and set-top-box–like environments.

## Run
- Install: `npm install`
- Dev server: `npm run dev` (webpack-dev-server at `http://localhost:3000`)
- Production build: `npm run build`

## Architecture
- State: Zustand (`src/store/epgStore.ts`) holds channels, programs, selections, assigned streams, and the active stream.
- EPG fetch: `src/services/epgService.ts` calls `/api/epg` (proxy to `https://tvprofil.net/xmltv/data/epg_tvprofil.net.xml`), parses XML (`src/utils/xmlParser.ts`), populates the store, and randomly assigns a stream to each channel.
- UI: `TVInterface` lazy-loads `DatePicker`, `ChannelList`, `EPGList`; background `VideoPlayer` plays the active stream; a default background video is shown before any selection.
- Video: `src/components/video/VideoPlayer.tsx` uses the Shaka compiled build (ES5-friendly), auto-recovers on stall/error with exponential backoff (max 5 attempts), and logs to console.

## Streams
- Angel One (HLS): `https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8`
- Tears of Steel (HLS): `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`
- Big Buck Bunny (HLS): `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

Assignment: on EPG load each channel gets one of these streams at random; clicking a channel or EPG card activates that stream in the background player.

## Legacy/ES5 notes
- Webpack target: `['web', 'es5']` (see `webpack.config.js`); Babel preset-env targets Chrome 20; `core-js/stable` and `regenerator-runtime` are in the entry.
- Modern syntax is transpiled away; Shaka compiled is ES5-friendly.
- If you need to run without `fetch`, add an XHR fallback in `src/api/apiFetch.ts` (currently uses native fetch).

## Dev tips
- CORS: dev proxy covers `/api/epg`; alternatively, drop the XML into `public/epg_tvprofil.net.xml` and load locally.
- Recovery debug: console shows stall/error/backoff events from `VideoPlayer.tsx`.
- First-load UX: before any selection, the default DASH stream (art-of-motion) with Widevine proxy plays in the background.
