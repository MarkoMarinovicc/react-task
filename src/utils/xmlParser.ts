import { Channel, Program } from '../store/epgStore';

interface ParsedEPG {
  channels: Channel[];
  programs: Program[];
  dates: string[];
}

export function parseEPGXML(xmlString: string): ParsedEPG {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Failed to parse XML: ' + parserError.textContent);
  }

  const channels: Channel[] = [];
  const programs: Program[] = [];
  const dateSet = new Set<string>();

  const channelElements = xmlDoc.querySelectorAll('channel');
  channelElements.forEach(function(channelEl) {
    const id = channelEl.getAttribute('id');
    if (!id) return;

    const displayNameEl = channelEl.querySelector('display-name');
    const iconEl = channelEl.querySelector('icon');

    channels.push({
      id: id,
      displayName: displayNameEl?.textContent || id,
      icon: iconEl?.getAttribute('src') || undefined,
    });
  });

  const programmeElements = xmlDoc.querySelectorAll('programme');
  programmeElements.forEach(function(programmeEl) {
    const channelId = programmeEl.getAttribute('channel');
    const start = programmeEl.getAttribute('start');
    const stop = programmeEl.getAttribute('stop');

    if (!channelId || !start || !stop) return;

    const titleEl = programmeEl.querySelector('title');
    const descEl = programmeEl.querySelector('desc');
    const categoryEl = programmeEl.querySelector('category');

    const dateStr = start.substring(0, 8);
    const formattedDate = dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8);
    dateSet.add(formattedDate);

    const programId = channelId + '_' + start + '_' + stop;

    programs.push({
      id: programId,
      channelId: channelId,
      title: titleEl?.textContent || 'Untitled',
      start: parseXMLTVDate(start),
      stop: parseXMLTVDate(stop),
      desc: descEl?.textContent || undefined,
      category: categoryEl?.textContent || undefined,
    });
  });

  const dates = Array.from(dateSet).sort();

  return {
    channels,
    programs,
    dates,
  };
}

function parseXMLTVDate(xmltvDate: string): string {
  const year = xmltvDate.substring(0, 4);
  const month = xmltvDate.substring(4, 6);
  const day = xmltvDate.substring(6, 8);
  const hour = xmltvDate.substring(8, 10);
  const minute = xmltvDate.substring(10, 12);
  const second = xmltvDate.substring(12, 14);

  return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
}

