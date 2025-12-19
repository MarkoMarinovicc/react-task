import { useEffect, useCallback, Suspense, lazy } from 'react';
import { useEPGStore } from '../../store/epgStore';
import { fetchEPGData } from '../../services/epgService';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import VideoPlayer from '../video/VideoPlayer';

const DatePicker = lazy(function() {
  return import('./DatePicker').then(function(module) {
    return { default: module.default };
  });
});

const ChannelList = lazy(function() {
  return import('./ChannelList').then(function(module) {
    return { default: module.default };
  });
});

const EPGList = lazy(function() {
  return import('./EPGList').then(function(module) {
    return { default: module.default };
  });
});

export default function TVInterface() {
  const loading = useEPGStore(function(state) {
    return state.loading;
  });
  const error = useEPGStore(function(state) {
    return state.error;
  });

  const handleFetchEPGData = useCallback(function() {
    fetchEPGData();
  }, []);

  useEffect(function() {
    handleFetchEPGData();
  }, [handleFetchEPGData]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-t from-gray-600 to-black flex items-center justify-center">
        <Loading message="Loading EPG data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-t from-gray-600 to-black flex items-center justify-center">
        <Error
          message={error}
          onRetry={handleFetchEPGData}
          retryLabel="Retry"
          tip="Tip: If you encounter CORS issues, download the XML file and place it in the public/ folder as epg_tvprofil.net.xml"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-t from-gray-600 to-black text-white overflow-hidden relative">
      {/* Background Video Player */}
      <VideoPlayer
        streamUrl="https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd"
        licenseServer="https://cwip-shaka-proxy.appspot.com/no_auth"
      />
      
      {/* UI Content */}
      <div className="h-full flex relative z-10">
        {/* Date Picker Column */}
        <div className="w-64 border-r border-gray-700 bg-gradient-to-t from-gray-600/30 to-black/50">
          <Suspense fallback={<Loading message="Loading date picker..." size="sm" />}>
            <DatePicker />
          </Suspense>
        </div>

        {/* Channel List Column */}
        <div className="w-80 border-r border-gray-700 bg-gradient-to-t from-gray-600/30 to-black/50">
          <Suspense fallback={<Loading message="Loading channels..." size="sm" />}>
            <ChannelList />
          </Suspense>
        </div>

        {/* EPG List Column */}
        <div className="flex-1 bg-gradient-to-t from-gray-600/30 to-black/50">
          <Suspense fallback={<Loading message="Loading programs..." size="sm" />}>
            <EPGList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

