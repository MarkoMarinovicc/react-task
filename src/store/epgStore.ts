import { create } from 'zustand';

export interface Channel {
  id: string;
  displayName: string;
  icon?: string;
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  start: string;
  stop: string;
  desc?: string;
  category?: string;
}

export interface StreamSource {
  id: string;
  name: string;
  url: string;
  licenseServer?: string;
}

export interface EPGState {
  channels: Channel[];
  programs: Program[];
  streams: StreamSource[];
  channelStreams: Record<string, StreamSource>;
  selectedChannel: string | null;
  selectedDate: string | null;
  selectedProgramId: string | null;
  availableDates: string[];
  loading: boolean;
  error: string | null;
  setChannels: (channels: Channel[]) => void;
  setPrograms: (programs: Program[]) => void;
  setStreams: (streams: StreamSource[]) => void;
  setChannelStreams: (channelStreams: Record<string, StreamSource>) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedProgramId: (programId: string | null) => void;
  setAvailableDates: (dates: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveStream: (stream: StreamSource | null) => void;
  activeStream: StreamSource | null;
  getProgramsForChannelAndDate: (channelId: string, date: string) => Program[];
}

export const useEPGStore = create<EPGState>((set, get) => ({
  channels: [],
  programs: [],
  streams: [],
  channelStreams: {},
  selectedChannel: null,
  selectedDate: null,
  selectedProgramId: null,
  availableDates: [],
  loading: false,
  error: null,
  activeStream: null,

  setChannels: function(channels: Channel[]) {
    set({ channels });
  },

  setPrograms: function(programs: Program[]) {
    set({ programs });
  },

  setStreams: function(streams: StreamSource[]) {
    set({ streams });
  },

  setChannelStreams: function(channelStreams: Record<string, StreamSource>) {
    set({ channelStreams });
  },

  setSelectedChannel: function(channelId: string | null) {
    set({ selectedChannel: channelId });
  },

  setSelectedDate: function(date: string | null) {
    set({ selectedDate: date });
  },

  setSelectedProgramId: function(programId: string | null) {
    set({ selectedProgramId: programId });
  },

  setAvailableDates: function(dates: string[]) {
    set({ availableDates: dates });
  },

  setLoading: function(loading: boolean) {
    set({ loading });
  },

  setError: function(error: string | null) {
    set({ error });
  },

  setActiveStream: function(stream: StreamSource | null) {
    set({ activeStream: stream });
  },

  getProgramsForChannelAndDate: function(channelId: string, date: string) {
    const state = get();
    const selectedDateStart = new Date(date + 'T00:00:00');
    const selectedDateEnd = new Date(date + 'T23:59:59');

    return state.programs.filter(function(program) {
      if (program.channelId !== channelId) {
        return false;
      }

      const programStart = new Date(program.start);
      const programEnd = new Date(program.stop);

      return (
        (programStart >= selectedDateStart && programStart <= selectedDateEnd) ||
        (programEnd >= selectedDateStart && programEnd <= selectedDateEnd) ||
        (programStart <= selectedDateStart && programEnd >= selectedDateEnd)
      );
    });
  },
}));

