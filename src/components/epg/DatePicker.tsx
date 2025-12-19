import { useMemo, useCallback } from 'react';
import { useEPGStore } from '../../store/epgStore';

export default function DatePicker() {
  const availableDates = useEPGStore(function(state) {
    return state.availableDates;
  });
  const selectedDate = useEPGStore(function(state) {
    return state.selectedDate;
  });
  const setSelectedDate = useEPGStore(function(state) {
    return state.setSelectedDate;
  });
  const selectedChannel = useEPGStore(function(state) {
    return state.selectedChannel;
  });
  const getProgramsForChannelAndDate = useEPGStore(function(state) {
    return state.getProgramsForChannelAndDate;
  });

  const formatDate = useCallback(function(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return 'Today';
    }
    if (isTomorrow) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formattedDates = useMemo(function() {
    const formatted: Record<string, string> = {};
    availableDates.forEach(function(date) {
      formatted[date] = formatDate(date);
    });
    return formatted;
  }, [availableDates, formatDate]);

  const hasDataForSelectedDate = useMemo(function() {
    if (!selectedChannel || !selectedDate) {
      return false;
    }
    const datePrograms = getProgramsForChannelAndDate(selectedChannel, selectedDate);
    return datePrograms.length > 0;
  }, [selectedChannel, selectedDate, getProgramsForChannelAndDate]);

  const handleDateClick = useCallback(function(date: string) {
    setSelectedDate(date);
  }, [setSelectedDate]);

  if (availableDates.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No dates available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-white">Date</h2>
        <div className="space-y-2">
          {availableDates.map(function(date) {
            const isSelected = selectedDate === date;
            return (
              <button
                key={date}
                onClick={function() {
                  handleDateClick(date);
                }}
                className={`
                  w-full p-3 rounded-lg text-left transition-all
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{formattedDates[date]}</div>
                    <div className="text-xs opacity-75 mt-1">{date}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {selectedChannel && selectedDate && !hasDataForSelectedDate && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium mb-1">No Information Available</p>
            <p className="text-yellow-500/80 text-xs">
              The selected date has no program data for the chosen channel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

