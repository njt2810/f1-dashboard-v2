import { parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export interface RaceEvent {
  name: string;
  type: 'Race' | 'Sprint Race';
  date: Date;
  time: string;
  link?: string;
}

export function parseRaceSchedule(csvData: string): RaceEvent[] {
  const lines = csvData.split('\n').filter(line => line.trim());
  const events: RaceEvent[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(s => s.trim());
    const [name, type, , , sgDate, sgTime] = columns;
    
    if (!name || !type || !sgDate || !sgTime) continue;

    try {
      // Create date object from Singapore time
      const date = new Date(sgDate);
      
      events.push({
        name,
        type: type as 'Race' | 'Sprint Race',
        date,
        time: sgTime,
        link: columns[6]
      });
    } catch (error) {
      console.error(`Error parsing date for race: ${name}`, error);
      continue;
    }
  }

  return events;
}

export function getGrandPrixKey(fullName: string): string {
  // Extract the Grand Prix name from the full race title
  const match = fullName.match(/FORMULA 1 (?:.*?) ([A-Za-z\s]+) GRAND PRIX/i);
  if (match) {
    return `${match[1].trim()} GRAND PRIX`;
  }
  
  // Special case for Emilia Romagna
  if (fullName.includes('EMILIA ROMAGNA')) {
    return 'GRAN PREMIO DEL MADE IN ITALY E DELL\'EMILIA ROMAGNA';
  }
  
  // Special case for São Paulo
  if (fullName.includes('SÃO PAULO')) {
    return 'BRAZILIAN GRAND PRIX';
  }
  
  // Special case for Mexico City
  if (fullName.includes('MÉXICO')) {
    return 'MEXICAN GRAND PRIX';
  }

  return fullName;
}