import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useEPGStore } from '../../store/epgStore';
import { Program } from '../../store/epgStore';

export default function EPGList() {
  const selectedChannel = useEPGStore(function(state) {
    return state.selectedChannel;
  });
  const selectedDate = useEPGStore(function(state) {
    return state.selectedDate;
  });
  const getProgramsForChannelAndDate = useEPGStore(function(state) {
    return state.getProgramsForChannelAndDate;
  });

  const [currentTime, setCurrentTime] = useState(function() {
    return new Date();
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentProgramRef = useRef<HTMLDivElement>(null);

  useEffect(function() {
    const interval = setInterval(function() {
      setCurrentTime(new Date());
    }, 60000);

    return function() {
      clearInterval(interval);
    };
  }, []);

  const programs = useMemo(function() {
    if (!selectedChannel || !selectedDate) {
      return [];
    }
    return getProgramsForChannelAndDate(selectedChannel, selectedDate);
  }, [selectedChannel, selectedDate, getProgramsForChannelAndDate]);

  const getProgramStatus = useCallback(function(program: Program): 'past' | 'current' | 'future' {
    const now = currentTime.getTime();
    const startTime = new Date(program.start).getTime();
    const stopTime = new Date(program.stop).getTime();

    if (now < startTime) {
      return 'future';
    } else if (now >= startTime && now <= stopTime) {
      return 'current';
    } else {
      return 'past';
    }
  }, [currentTime]);

  useEffect(function() {
    if (programs.length === 0) {
      return;
    }

    const currentProgram = programs.find(function(program) {
      const status = getProgramStatus(program);
      return status === 'current';
    });

    if (currentProgram && currentProgramRef.current) {
      setTimeout(function() {
        if (currentProgramRef.current) {
          currentProgramRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }, 100);
    }
  }, [programs, getProgramStatus]);

  const formatTime = useCallback(function(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  const formattedTimes = useMemo(function() {
    const formatted: Record<string, { start: string; stop: string }> = {};
    programs.forEach(function(program) {
      formatted[program.id] = {
        start: formatTime(program.start),
        stop: formatTime(program.stop),
      };
    });
    return formatted;
  }, [programs, formatTime]);

  if (!selectedChannel || !selectedDate) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">Select a channel and date to view programs</p>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No Information Available</p>
          <p className="text-gray-600 text-sm">
            No programs found for the selected channel and date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-white">Programs</h2>
        <div className="space-y-3">
          {programs.map(function(program) {
            const status = getProgramStatus(program);
            const isPast = status === 'past';
            const isCurrent = status === 'current';

            return (
              <div
                key={program.id}
                ref={isCurrent ? currentProgramRef : null}
                className={`
                  rounded-lg p-4 transition-colors
                  ${isPast
                    ? 'bg-gray-800/50 opacity-60'
                    : 'bg-gray-800 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {isCurrent && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                    )}
                    <h3 className={`
                      font-semibold text-lg flex-1
                      ${isPast ? 'text-gray-500' : 'text-white'}
                    `}>
                      {program.title}
                    </h3>
                  </div>
                  <div className={`text-sm ml-4 ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                    {formattedTimes[program.id]?.start} - {formattedTimes[program.id]?.stop}
                  </div>
                </div>
                {program.category && (
                  <div className="mb-2">
                    <span className={`
                      inline-block text-white text-xs px-2 py-1 rounded
                      ${isPast ? 'bg-gray-700' : 'bg-blue-600'}
                    `}>
                      {program.category}
                    </span>
                  </div>
                )}
                {program.desc && (
                  <p className={`text-sm line-clamp-2 ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                    {program.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

