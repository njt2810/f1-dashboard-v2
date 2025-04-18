import { Flag } from 'lucide-react';
import { format } from 'date-fns';
import type { Race } from '../types/f1';

interface LatestRaceResultsProps {
  lastRace: Race | null;
  isLoading: boolean;
  error: string | null;
}

export function LatestRaceResults({ lastRace, isLoading, error }: LatestRaceResultsProps) {
  const formatConstructorName = (name: string): string => {
    return name.replace(/\s*F1\s*Team\s*$/i, '');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Flag className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold font-rationalist">Latest Race Results</h2>
        </div>
        <div className="text-center text-gray-600 py-8">
          {error}
        </div>
      </div>
    );
  }

  if (!lastRace) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Flag className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold font-rationalist">Latest Race Results</h2>
        </div>
        <div className="text-center text-gray-600 py-8">
          No races completed this season. Check back soon!
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const raceYear = parseInt(lastRace.season);

  // Find the driver with the fastest lap
  const fastestLapDriver = lastRace.results.reduce((fastest, current) => {
    if (!current.fastestLap) return fastest;
    if (!fastest) return current;
    if (!fastest.fastestLap) return current;
    
    // Convert lap times to seconds for comparison
    const fastestTime = fastest.fastestLap.time.split(':').reduce((acc, time) => (60 * acc) + parseFloat(time), 0);
    const currentTime = current.fastestLap.time.split(':').reduce((acc, time) => (60 * acc) + parseFloat(time), 0);
    
    return currentTime < fastestTime ? current : fastest;
  }, null as (typeof lastRace.results[0] | null));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Flag className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold font-rationalist">Latest Race Results</h2>
      </div>
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-gray-800 font-rationalist">
          {lastRace.name}
        </h3>
        <p className="text-gray-600">
          {lastRace.circuit.name}
        </p>
        <p className="text-gray-600">
          {format(new Date(lastRace.date), 'dd MMM yyyy')}
          {raceYear < currentYear && (
            <span className="ml-2 text-yellow-600">
              (Last race of {raceYear})
            </span>
          )}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-center w-12 font-rationalist">POS</th>
              <th className="pb-3 text-center font-rationalist">DRIVER</th>
              <th className="pb-3 text-center font-rationalist">TEAM</th>
              <th className="pb-3 text-center font-rationalist">T/S</th>
              <th className="pb-3 text-center w-12 font-rationalist">PTS</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {lastRace.results.map((result) => (
              <tr 
                key={result.driver.code} 
                className={`border-b border-gray-100 last:border-0 hover:bg-gray-50`}
                style={result.driver.code === fastestLapDriver?.driver.code ? { backgroundColor: '#B88CDE33' } : undefined}
              >
                <td className="py-2 text-center">
                  {result.position}
                </td>
                <td className="py-2 text-center">
                  {result.driver.firstName[0]}.{result.driver.lastName}
                </td>
                <td className="py-2 text-center text-gray-600">
                  {formatConstructorName(result.constructor.name)}
                </td>
                <td className="py-2 text-center text-gray-600">
                  {result.time || result.status}
                </td>
                <td className="py-2 text-center font-medium">
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}