import { useCallback } from 'react';
import { useEPGStore } from '../../store/epgStore';

export default function ChannelList() {
  const channels = useEPGStore(function(state) {
    return state.channels;
  });
  const selectedChannel = useEPGStore(function(state) {
    return state.selectedChannel;
  });
  const channelStreams = useEPGStore(function(state) {
    return state.channelStreams;
  });
  const setSelectedChannel = useEPGStore(function(state) {
    return state.setSelectedChannel;
  });
  const setSelectedProgramId = useEPGStore(function(state) {
    return state.setSelectedProgramId;
  });
  const setActiveStream = useEPGStore(function(state) {
    return state.setActiveStream;
  });

  const handleChannelClick = useCallback(function(channelId: string) {
    setSelectedChannel(channelId);
    setSelectedProgramId(null);
    const assignedStream = channelStreams[channelId];
    if (assignedStream) {
      setActiveStream(assignedStream);
    }
  }, [setSelectedChannel, setSelectedProgramId, channelStreams, setActiveStream]);

  const handleImageError = useCallback(function(e: React.SyntheticEvent<HTMLImageElement>) {
    (e.target as HTMLImageElement).style.display = 'none';
  }, []);

  if (channels.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No channels available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-white">Channels</h2>
        <div className="space-y-2">
          {channels.map(function(channel) {
            const isSelected = selectedChannel === channel.id;
            return (
              <button
                key={channel.id}
                onClick={function() {
                  handleChannelClick(channel.id);
                }}
                className={`
                  w-full p-3 rounded-lg text-left transition-all flex items-center gap-3
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {channel.icon ? (
                  <img
                    src={channel.icon}
                    alt={channel.displayName}
                    className="w-10 h-10 rounded object-contain"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center text-xs font-bold">
                    {channel.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{channel.displayName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

