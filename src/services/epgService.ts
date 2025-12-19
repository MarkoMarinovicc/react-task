import { api } from '../api/apiFetch';
import { parseEPGXML } from '../utils/xmlParser';
import { useEPGStore } from '../store/epgStore';

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

    if (parsed.channels.length > 0 && !store.selectedChannel) {
      store.setSelectedChannel(parsed.channels[0].id);
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

