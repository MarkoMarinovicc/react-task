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

export interface EPGState {
  channels: Channel[];
  programs: Program[];
  selectedChannel: string | null;
  selectedDate: string | null;
  availableDates: string[];
  loading: boolean;
  error: string | null;
  setChannels: (channels: Channel[]) => void;
  setPrograms: (programs: Program[]) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setAvailableDates: (dates: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProgramsForChannelAndDate: (channelId: string, date: string) => Program[];
}

export const useEPGStore = create<EPGState>((set, get) => ({
  channels: [],
  programs: [],
  selectedChannel: null,
  selectedDate: null,
  availableDates: [],
  loading: false,
  error: null,

  setChannels: function(channels: Channel[]) {
    set({ channels });
  },

  setPrograms: function(programs: Program[]) {
    set({ programs });
  },

  setSelectedChannel: function(channelId: string | null) {
    set({ selectedChannel: channelId });
  },

  setSelectedDate: function(date: string | null) {
    set({ selectedDate: date });
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

