import { useEffect, useState } from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { Standings } from '../components/Standings';
import { LatestRaceResults } from '../components/LatestRaceResults';
import { F1News } from '../components/F1News';
import { parseRaceSchedule, getGrandPrixKey, type RaceEvent } from '../utils/raceSchedule';
import type { Race, DriverStanding, ConstructorStanding, NewsItem } from '../types/f1';

const raceScheduleCsv = `Grand Prix,Session,Date (UTC),Time (UTC),Date (SG Time),Time (SG Time),Link
FORMULA 1 LOUIS VUITTON AUSTRALIAN GRAND PRIX 2025,Race,16/3/2025,12:00:00,2025-03-16,08:00:00 pm,https://www.formula1.com/en/racing/2025/australia/circuit
FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025,Sprint Race,22/3/2025,11:00:00,2025-03-22,07:00:00 pm,https://www.formula1.com/en/racing/2025/china/circuit
FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025,Race,23/3/2025,15:00:00,2025-03-23,11:00:00 pm,https://www.formula1.com/en/racing/2025/china/circuit
FORMULA 1 LENOVO JAPANESE GRAND PRIX 2025,Race,6/4/2025,5:00:00,2025-04-06,01:00:00 pm,https://www.formula1.com/en/racing/2025/japan/circuit
FORMULA 1 GULF AIR BAHRAIN GRAND PRIX 2025,Race,13/4/2025,15:00:00,2025-04-13,11:00:00 pm,https://www.formula1.com/en/racing/2025/bahrain/circuit
FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025,Race,20/4/2025,17:00:00,2025-04-21,01:00:00 am,https://www.formula1.com/en/racing/2025/saudi-arabia/circuit
FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025,Sprint Race,3/5/2025,16:00:00,2025-05-04,12:00:00 am,https://www.formula1.com/en/racing/2025/miami/circuit
FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025,Race,4/5/2025,20:00:00,2025-05-05,04:00:00 am,https://www.formula1.com/en/racing/2025/miami/circuit
FORMULA 1 AWS GRAN PREMIO DEL MADE IN ITALY E DELL'EMILIA ROMAGNA 2025,Race,18/5/2025,13:00:00,2025-05-18,09:00:00 pm,https://www.formula1.com/en/racing/2025/emiliaromagna/circuit
FORMULA 1 TAG HEUER GRAND PRIX DE MONACO 2025,Race,25/5/2025,13:00:00,2025-05-25,09:00:00 pm,https://www.formula1.com/en/racing/2025/monaco/circuit
FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2025,Race,1/6/2025,13:00:00,2025-06-01,09:00:00 pm,https://www.formula1.com/en/racing/2025/spain/circuit
FORMULA 1 PIRELLI GRAND PRIX DU CANADA 2025,Race,15/6/2025,18:00:00,2025-06-16,02:00:00 am,https://www.formula1.com/en/racing/2025/canada/circuit
FORMULA 1 MSC CRUISES AUSTRIAN GRAND PRIX 2025,Race,29/6/2025,13:00:00,2025-06-29,09:00:00 pm,https://www.formula1.com/en/racing/2025/austria/circuit
FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2025,Race,6/7/2025,14:00:00,2025-07-06,10:00:00 pm,https://www.formula1.com/en/racing/2025/great-britain/circuit
FORMULA 1 MOAT & CHANDON BELGIAN GRAND PRIX 2025,Sprint Race,26/7/2025,10:00:00,2025-07-26,06:00:00 pm,https://www.formula1.com/en/racing/2025/belgium/circuit
FORMULA 1 MOAT & CHANDON BELGIAN GRAND PRIX 2025,Race,27/7/2025,13:00:00,2025-07-27,09:00:00 pm,https://www.formula1.com/en/racing/2025/belgium/circuit
FORMULA 1 LENOVO HUNGARIAN GRAND PRIX 2025,Race,3/8/2025,13:00:00,2025-08-03,09:00:00 pm,https://www.formula1.com/en/racing/2025/hungary/circuit
FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2025,Race,31/8/2025,13:00:00,2025-08-31,09:00:00 pm,https://www.formula1.com/en/racing/2025/netherlands/circuit
FORMULA 1 PIRELLI GRAN PREMIO DITALIA 2025,Race,7/9/2025,13:00:00,2025-09-07,09:00:00 pm,https://www.formula1.com/en/racing/2025/italy/circuit
FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2025,Race,21/9/2025,11:00:00,2025-09-21,07:00:00 pm,https://www.formula1.com/en/racing/2025/azerbaijan/circuit
FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2025,Race,5/10/2025,12:00:00,2025-10-05,08:00:00 pm,https://www.formula1.com/en/racing/2025/singapore/circuit
FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2025,Sprint Race,18/10/2025,17:00:00,2025-10-19,01:00:00 am,https://www.formula1.com/en/racing/2025/united-states/circuit
FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2025,Race,19/10/2025,19:00:00,2025-10-20,03:00:00 am,https://www.formula1.com/en/racing/2025/united-states/circuit
FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2025,Race,26/10/2025,20:00:00,2025-10-27,04:00:00 am,https://www.formula1.com/en/racing/2025/mexico/circuit
FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2025,Sprint Race,8/11/2025,14:00:00,2025-11-08,10:00:00 pm,https://www.formula1.com/en/racing/2025/brazil/circuit
FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2025,Race,9/11/2025,17:00:00,2025-11-10,01:00:00 am,https://www.formula1.com/en/racing/2025/brazil/circuit
FORMULA 1 HEINEKEN LAS VEGAS GRAND PRIX 2025,Race,23/11/2025,4:00:00,2025-11-23,12:00:00 pm,https://www.formula1.com/en/racing/2025/las-vegas/circuit
FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025,Sprint Race,29/11/2025,14:00:00,2025-11-29,10:00:00 pm,https://www.formula1.com/en/racing/2025/qatar/circuit
FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025,Race,30/11/2025,16:00:00,2025-12-01,12:00:00 am,https://www.formula1.com/en/racing/2025/qatar/circuit
FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2025,Race,7/12/2025,13:00:00,2025-12-07,09:00:00 pm,https://www.formula1.com/en/racing/2025/united-arab-emirates/circuit`;

const circuitInfo = {
  'AUSTRALIAN GRAND PRIX': {
    circuitName: 'Albert Park Circuit',
    locality: 'Melbourne',
    country: 'Australia',
    length: '5.278',
    turns: 14,
    drsZones: 4,
    lapRecord: {
      time: '1:20.235',
      driver: 'Sergio Perez',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png'
  },
  'CHINESE GRAND PRIX': {
    circuitName: 'Shanghai International Circuit',
    locality: 'Shanghai',
    country: 'China',
    length: '5.451',
    turns: 16,
    drsZones: 2,
    lapRecord: {
      time: '1:32.238',
      driver: 'Michael Schumacher',
      year: 2004
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png'
  },
  'JAPANESE GRAND PRIX': {
    circuitName: 'Suzuka International Racing Course',
    locality: 'Suzuka',
    country: 'Japan',
    length: '5.807',
    turns: 18,
    drsZones: 2,
    lapRecord: {
      time: '1:30.983',
      driver: 'Lewis Hamilton',
      year: 2019
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png'
  },
  'BAHRAIN GRAND PRIX': {
    circuitName: 'Bahrain International Circuit',
    locality: 'Sakhir',
    country: 'Bahrain',
    length: '5.412',
    turns: 15,
    drsZones: 3,
    lapRecord: {
      time: '1:31.447',
      driver: 'Pedro de la Rosa',
      year: 2005
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png'
  },
  'SAUDI ARABIAN GRAND PRIX': {
    circuitName: 'Jeddah Corniche Circuit',
    locality: 'Jeddah',
    country: 'Saudi Arabia',
    length: '6.174',
    turns: 27,
    drsZones: 3,
    lapRecord: {
      time: '1:30.734',
      driver: 'Lewis Hamilton',
      year: 2021
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png'
  },
  'MIAMI GRAND PRIX': {
    circuitName: 'Miami International Autodrome',
    locality: 'Miami',
    country: 'United States',
    length: '5.412',
    turns: 19,
    drsZones: 3,
    lapRecord: {
      time: '1:29.708',
      driver: 'Max Verstappen',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png'
  },
  'GRAN PREMIO DEL MADE IN ITALY E DELL\'EMILIA ROMAGNA': {
    circuitName: 'Autodromo Enzo e Dino Ferrari',
    locality: 'Imola',
    country: 'Italy',
    length: '4.909',
    turns: 19,
    drsZones: 2,
    lapRecord: {
      time: '1:15.484',
      driver: 'Lewis Hamilton',
      year: 2020
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png'
  },
  'MONACO GRAND PRIX': {
    circuitName: 'Circuit de Monaco',
    locality: 'Monte Carlo',
    country: 'Monaco',
    length: '3.337',
    turns: 19,
    drsZones: 1,
    lapRecord: {
      time: '1:12.909',
      driver: 'Lewis Hamilton',
      year: 2021
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png'
  },
  'SPANISH GRAND PRIX': {
    circuitName: 'Circuit de Barcelona-Catalunya',
    locality: 'Barcelona',
    country: 'Spain',
    length: '4.675',
    turns: 16,
    drsZones: 2,
    lapRecord: {
      time: '1:18.149',
      driver: 'Max Verstappen',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png'
  },
  'CANADIAN GRAND PRIX': {
    circuitName: 'Circuit Gilles-Villeneuve',
    locality: 'Montreal',
    country: 'Canada',
    length: '4.361',
    turns: 14,
    drsZones: 3,
    lapRecord: {
      time: '1:13.078',
      driver: 'Valtteri Bottas',
      year: 2019
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png'
  },
  'AUSTRIAN GRAND PRIX': {
    circuitName: 'Red Bull Ring',
    locality: 'Spielberg',
    country: 'Austria',
    length: '4.318',
    turns: 10,
    drsZones: 3,
    lapRecord: {
      time: '1:05.619',
      driver: 'Carlos Sainz',
      year: 2020
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png'
  },
  'BRITISH GRAND PRIX': {
    circuitName: 'Silverstone Circuit',
    locality: 'Silverstone',
    country: 'Great Britain',
    length: '5.891',
    turns: 18,
    drsZones: 2,
    lapRecord: {
      time: '1:27.097',
      driver: 'Max Verstappen',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png'
  },
  'BELGIAN GRAND PRIX': {
    circuitName: 'Circuit de Spa-Francorchamps',
    locality: 'Spa',
    country: 'Belgium',
    length: '7.004',
    turns: 19,
    drsZones: 2,
    lapRecord: {
      time: '1:46.286',
      driver: 'Valtteri Bottas',
      year: 2018
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png'
  },
  'HUNGARIAN GRAND PRIX': {
    circuitName: 'Hungaroring',
    locality: 'Budapest',
    country: 'Hungary',
    length: '4.381',
    turns: 14,
    drsZones: 2,
    lapRecord: {
      time: '1:16.627',
      driver: 'Lewis Hamilton',
      year: 2020
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png'
  },
  'DUTCH GRAND PRIX': {
    circuitName: 'Circuit Zandvoort',
    locality: 'Zandvoort',
    country: 'Netherlands',
    length: '4.259',
    turns: 14,
    drsZones: 2,
    lapRecord: {
      time: '1:11.097',
      driver: 'Lewis Hamilton',
      year: 2021
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png'
  },
  'ITALIAN GRAND PRIX': {
    circuitName: 'Autodromo Nazionale Monza',
    locality: 'Monza',
    country: 'Italy',
    length: '5.793',
    turns: 11,
    drsZones: 2,
    lapRecord: {
      time: '1:21.046',
      driver: 'Rubens Barrichello',
      year: 2004
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png'
  },
  'AZERBAIJAN GRAND PRIX': {
    circuitName: 'Baku City Circuit',
    locality: 'Baku',
    country: 'Azerbaijan',
    length: '6.003',
    turns: 20,
    drsZones: 2,
    lapRecord: {
      time: '1:43.009',
      driver: 'Charles Leclerc',
      year: 2019
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Azerbaijan_Circuit.png'
  },
  'SINGAPORE GRAND PRIX': {
    circuitName: 'Marina Bay Street Circuit',
    locality: 'Marina Bay',
    country: 'Singapore',
    length: '4.940',
    turns: 19,
    drsZones: 3,
    lapRecord: {
      time: '1:35.867',
      driver: 'Lewis Hamilton',
      year: 2018
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png'
  },
  'UNITED STATES GRAND PRIX': {
    circuitName: 'Circuit of The Americas',
    locality: 'Austin',
    country: 'United States',
    length: '5.513',
    turns: 20,
    drsZones: 2,
    lapRecord: {
      time: '1:36.169',
      driver: 'Charles Leclerc',
      year: 2019
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png'
  },
  'MEXICAN GRAND PRIX': {
    circuitName: 'Autódromo Hermanos Rodríguez',
    locality: 'Mexico City',
    country: 'Mexico',
    length: '4.304',
    turns: 17,
    drsZones: 3,
    lapRecord: {
      time: '1:17.774',
      driver: 'Valtteri Bottas',
      year: 2021
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png'
  },
  'BRAZILIAN GRAND PRIX': {
    circuitName: 'Autódromo José Carlos Pace',
    locality: 'São Paulo',
    country: 'Brazil',
    length: '4.309',
    turns: 15,
    drsZones: 2,
    lapRecord: {
      time: '1:10.540',
      driver: 'Valtteri Bottas',
      year: 2018
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png'
  },
  'LAS VEGAS GRAND PRIX': {
    circuitName: 'Las Vegas Strip Circuit',
    locality: 'Las Vegas',
    country: 'United States',
    length: '6.201',
    turns: 17,
    drsZones: 2,
    lapRecord: {
      time: '1:35.490',
      driver: 'Oscar Piastri',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png'
  },
  'QATAR GRAND PRIX': {
    circuitName: 'Lusail International Circuit',
    locality: 'Lusail',
    country: 'Qatar',
    length: '5.419',
    turns: 16,
    drsZones: 2,
    lapRecord: {
      time: '1:24.319',
      driver: 'Max Verstappen',
      year: 2023
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png'
  },
  'ABU DHABI GRAND PRIX': {
    circuitName: 'Yas Marina Circuit',
    locality: 'Abu Dhabi',
    country: 'UAE',
    length: '5.281',
    turns: 16,
    drsZones: 2,
    lapRecord: {
      time: '1:26.103',
      driver: 'Max Verstappen',
      year: 2021
    },
    circuitLayout: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png'
  }
};

const fallbackDriverStandings: DriverStanding[] = [];
const fallbackConstructorStandings: ConstructorStanding[] = [];
const fallbackNews: NewsItem[] = [
  {
    title: "F1 News Currently Unavailable",
    link: "#",
    pubDate: new Date().toISOString(),
    description: "Please check back later for the latest F1 news updates.",
    content: "",
    thumbnail: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800"
  }
];

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1/current';

export function Home() {
  const [nextRace, setNextRace] = useState<RaceEvent | null>(null);
  const [lastRace, setLastRace] = useState<Race | null>(null);
  const [lastRaceLoading, setLastRaceLoading] = useState(true);
  const [lastRaceError, setLastRaceError] = useState<string | null>(null);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse race schedule and find next race
    const events = parseRaceSchedule(raceScheduleCsv);
    const now = new Date();

    // Filter only Race events (not Sprint Races) and find the next race
    const races = events.filter(event => event.type === 'Race');
    const upcomingRaces = races.filter(race => {
      const raceDateTime = new Date(race.date);
      return raceDateTime > now;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (upcomingRaces.length > 0) {
      const next = upcomingRaces[0];
      const grandPrixKey = getGrandPrixKey(next.name);
      const circuit = circuitInfo[grandPrixKey];
      
      if (circuit) {
        setNextRace({
          raceName: next.name,
          date: next.date.toISOString().split('T')[0],
          time: next.time,
          Circuit: {
            circuitName: circuit.circuitName,
            Location: {
              locality: circuit.locality,
              country: circuit.country
            }
          },
          circuitLayout: circuit.circuitLayout,
          circuitInfo: {
            length: circuit.length,
            turns: circuit.turns,
            drsZones: circuit.drsZones,
            lapRecord: circuit.lapRecord
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchLatestRace = async () => {
      try {
        setLastRaceLoading(true);
        setLastRaceError(null);

        const response = await fetch(`${API_BASE_URL}/last/results`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.MRData?.RaceTable?.Races?.[0]) {
          setLastRace(null);
          setLastRaceError('No race results available yet.');
          return;
        }

        const raceData = data.MRData.RaceTable.Races[0];
        transformAndSetRaceData(raceData);
      } catch (err) {
        console.error('Error fetching latest race:', err);
        setLastRaceError('Failed to load results. Please try again later.');
        setLastRace(null);
      } finally {
        setLastRaceLoading(false);
      }
    };

    const transformAndSetRaceData = (raceData: any) => {
      const transformedRace: Race = {
        name: raceData.raceName,
        round: parseInt(raceData.round),
        date: raceData.date,
        season: raceData.season,
        circuit: {
          name: raceData.Circuit.circuitName,
          location: raceData.Circuit.Location.locality,
          country: raceData.Circuit.Location.country
        },
        results: raceData.Results.map((result: any) => ({
          position: parseInt(result.position),
          driver: {
            firstName: result.Driver.givenName,
            lastName: result.Driver.familyName,
            code: result.Driver.code
          },
          constructor: {
            name: result.Constructor.name,
            nationality: result.Constructor.nationality
          },
          time: result.Time?.time || null,
          status: result.status,
          points: parseInt(result.points),
          laps: parseInt(result.laps),
          grid: parseInt(result.grid),
          fastestLap: result.FastestLap ? {
            time: result.FastestLap.Time.time,
            lap: parseInt(result.FastestLap.lap)
          } : undefined
        }))
      };
      setLastRace(transformedRace);
    };

    const fetchStandings = async () => {
      try {
        const [driversRes, constructorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/driverStandings`),
          fetch(`${API_BASE_URL}/constructorStandings`)
        ]);

        if (!driversRes.ok || !constructorsRes.ok) {
          throw new Error('Failed to fetch standings');
        }

        const driversData = await driversRes.json();
        const constructorsData = await constructorsRes.json();

        if (driversData.MRData?.StandingsTable?.StandingsLists?.[0]) {
          const transformedDrivers = driversData.MRData.StandingsTable.StandingsLists[0].DriverStandings.map((standing: any) => ({
            position: parseInt(standing.position),
            driver: {
              firstName: standing.Driver.givenName,
              lastName: standing.Driver.familyName,
              code: standing.Driver.code
            },
            constructor: {
              name: standing.Constructors[0].name,
              nationality: standing.Constructors[0].nationality
            },
            points: parseInt(standing.points),
            wins: parseInt(standing.wins)
          }));
          setDriverStandings(transformedDrivers);
        }

        if (constructorsData.MRData?.StandingsTable?.StandingsLists?.[0]) {
          const transformedConstructors = constructorsData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map((standing: any) => ({
            position: parseInt(standing.position),
            constructor: {
              name: standing.Constructor.name,
              nationality: standing.Constructor.nationality
            },
            points: parseInt(standing.points),
            wins: parseInt(standing.wins)
          }));
          setConstructorStandings(transformedConstructors);
        }
      } catch (error) {
        console.error('Error fetching standings:', error);
        setError('Unable to fetch standings. Please try again later.');
        setDriverStandings([]);
        setConstructorStandings([]);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.autosport.com/rss/f1/news/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.items?.length > 0) {
          setNews(data.items.slice(0, 5));
        } else {
          setNews(fallbackNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(fallbackNews);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchLatestRace(),
          fetchStandings(),
          fetchNews()
        ]);
      } catch (err) {
        console.error('Error fetching F1 data:', err);
        setError('Unable to fetch live data. Some content may be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Schedule daily updates at 9:05 AM Singapore time
    const scheduleNextUpdate = () => {
      const now = new Date();
      const sgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
      
      // Set target time to 9:05 AM
      const targetTime = new Date(sgTime);
      targetTime.setHours(9, 5, 0, 0);
      
      // If it's past 9:05 AM, schedule for next day
      if (sgTime > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      // Convert target time back to local time for setTimeout
      const targetLocal = new Date(targetTime.toLocaleString('en-US', { timeZone: 'UTC' }));
      const msUntilTarget = targetLocal.getTime() - now.getTime();
      
      return setTimeout(() => {
        fetchData();
        // Schedule next update after this one completes
        scheduleNextUpdate();
      }, msUntilTarget);
    };

    const timeoutId = scheduleNextUpdate();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-6 space-y-4">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <CountdownTimer nextRace={nextRace} />
      </div>

      <div className="w-full">
        <F1News news={news} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <LatestRaceResults 
            lastRace={lastRace} 
            isLoading={lastRaceLoading}
            error={lastRaceError}
          />
        </div>
        <div className="lg:col-span-2">
          <Standings drivers={driverStandings} constructors={constructorStandings} />
        </div>
      </div>
    </div>
  );
}