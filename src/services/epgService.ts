import { api } from '../api/apiFetch';
import { parseEPGXML } from '../utils/xmlParser';
import { useEPGStore } from '../store/epgStore';
import { STREAM_SOURCES, StreamSource } from '../config/streams';

function assignStreamsToChannels<T extends { id: string }>(
  items: T[],
  streams: StreamSource[]
): Record<string, StreamSource> {
  const mapping: Record<string, StreamSource> = {};
  if (streams.length === 0) {
    return mapping;
  }
  items.forEach(function(item) {
    const randomStream = streams[Math.floor(Math.random() * streams.length)];
    mapping[item.id] = randomStream;
  });
  return mapping;
}

export async function fetchEPGData() {
  const store = useEPGStore.getState();
  store.setLoading(true);
  store.setError(null);

  try {
    const response = await api.get('/api/epg', {
      headers: {
        'Accept': 'application/xml, text/xml',
      },
    });

    const parsed = parseEPGXML(response.data);

    store.setChannels(parsed.channels);
    store.setPrograms(parsed.programs);
    store.setAvailableDates(parsed.dates);
    store.setStreams(STREAM_SOURCES);

    const channelStreams = assignStreamsToChannels(parsed.channels, STREAM_SOURCES);
    store.setChannelStreams(channelStreams);

    if (parsed.channels.length > 0 && !store.selectedChannel) {
      store.setSelectedDate(parsed.dates[0]);
    }
    if (parsed.dates.length > 0 && !store.selectedDate) {
      store.setSelectedDate(parsed.dates[0]);
    }

    store.setLoading(false);
    store.setError(null);
  } catch (error: any) {
    store.setError('Failed to load EPG data. Please check your connection.');
    store.setLoading(false);
  }
}

