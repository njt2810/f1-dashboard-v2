import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Flag, MapPin, Calendar } from 'lucide-react';

interface CountdownTimerProps {
  nextRace: {
    raceName: string;
    date: string;
    time: string;
    Circuit: {
      circuitName: string;
      Location: {
        locality: string;
        country: string;
      };
    };
    circuitLayout?: string;
    circuitInfo?: {
      length: string;
      turns: number;
      drsZones: number;
      lapRecord?: {
        time: string;
        driver: string;
        year: number;
      };
    };
  };
}

export function CountdownTimer({ nextRace }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [formattedDateTime, setFormattedDateTime] = useState<string>('');

  useEffect(() => {
    if (!nextRace?.date || !nextRace?.time) return;

    try {
      // Parse the time separately
      const [timeValue, period] = nextRace.time.split(' ');
      const [hours, minutes] = timeValue.split(':').map(Number);
      
      // Convert to 24-hour format if needed
      let hour = hours;
      if (period?.toLowerCase() === 'pm' && hours < 12) {
        hour += 12;
      } else if (period?.toLowerCase() === 'am' && hours === 12) {
        hour = 0;
      }

      // Create the race date object
      const raceDateTime = new Date(`${nextRace.date}T${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+08:00`);
      
      // Set formatted date time
      setFormattedDateTime(format(raceDateTime, "EEEE, MMMM d, h:mm a 'SGT'"));

      const timer = setInterval(() => {
        const now = new Date();
        const diff = raceDateTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error('Error creating race date:', error);
      return;
    }
  }, [nextRace]);

  if (!nextRace?.Circuit) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Loading race information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 pt-4">
        <div className="flex items-center gap-2">
          <Flag className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold font-rationalist">Next Race</h2>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl text-gray-900 font-rationalist">{nextRace.raceName}</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-lg">
                    {nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.locality}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-lg">{formattedDateTime}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Flag className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-lg font">
                    {nextRace.Circuit.Location.country} Grand Prix
                  </span>
                </div>
              </div>
            </div>

            {nextRace.circuitInfo && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 font-rationalist">First Grand Prix</div>
                  <div className="text-xl font-bold">{nextRace.circuitInfo.lapRecord?.year || '2004'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 font-rationalist">Number of Laps</div>
                  <div className="text-xl font-bold">{Math.round(305 / parseFloat(nextRace.circuitInfo.length))}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 font-rationalist">Circuit Length</div>
                  <div className="text-xl font-bold">{nextRace.circuitInfo.length}</div>
                  <div className="text-sm text-gray-500">km</div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 font-rationalist">Race Distance</div>
                  <div className="text-xl font-bold">305.066</div>
                  <div className="text-sm text-gray-500">km</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 font-rationalist">Lap Record</div>
                  <div className="text-xl font-bold">{nextRace.circuitInfo.lapRecord?.time}</div>
                  <div className="text-sm text-gray-500">
                    {nextRace.circuitInfo.lapRecord?.driver} ({nextRace.circuitInfo.lapRecord?.year})
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="mb-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 font-rationalist">Race Starts In</h4>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-lg p-2 flex flex-col items-center justify-center border border-red-600">
                    <div className="text-2xl font-bold text-red-600">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider font-rationalist">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {nextRace.circuitLayout && (
              <div className="relative w-full aspect-[16/9]">
                <img
                  src={nextRace.circuitLayout}
                  alt={`${nextRace.Circuit.circuitName} layout`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}