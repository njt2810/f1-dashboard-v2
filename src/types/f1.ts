// Race Results Types
export interface Driver {
  firstName: string;
  lastName: string;
  code: string;
}

export interface Constructor {
  name: string;
  nationality: string;
}

export interface RaceResult {
  position: number;
  driver: Driver;
  constructor: Constructor;
  time?: string;
  status: string;
  points: number;
  laps: number;
  grid: number;
  fastestLap?: {
    time: string;
    lap: number;
  };
}

export interface Race {
  name: string;
  round: number;
  date: string;
  season: string;
  circuit: {
    name: string;
    location: string;
    country: string;
  };
  results: RaceResult[];
}

// Driver Standings Types
export interface DriverStanding {
  position: number;
  driver: Driver;
  constructor: Constructor;
  points: number;
  wins: number;
}

// Constructor Standings Types
export interface ConstructorStanding {
  position: number;
  constructor: Constructor;
  points: number;
  wins: number;
}

// News Types
export interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure?: {
    link: string;
    type: string;
    length: string;
  };
}

export interface NewsResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    description: string;
  };
  items: NewsItem[];
}