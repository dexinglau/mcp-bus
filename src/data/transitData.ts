export interface NextBus {
  arrivalMinutes: number; // 0 for "Arr"
  load: 'seats' | 'standing' | 'crowded';
  type: 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
  wheelchair: boolean; // WAB
}

export interface BusArrivalInfo {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT Buses' | 'Tower Transit' | 'Go-Ahead Singapore';
  destination: string;
  subDestination?: string;
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  nextBuses: [NextBus, NextBus, NextBus];
  firstBus: string;
  lastBus: string;
}

export interface MRTConnection {
  code: string;
  line: 'NSL' | 'EWL' | 'NEL' | 'CCL' | 'DTL' | 'TEL';
  color: string;
  name: string;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  directionDesc: string;
  mrtConnections: MRTConnection[];
  services: string[];
  lat: number;
  lng: number;
  landmarks: string[];
}

export interface RouteStopNode {
  stopCode: string;
  stopName: string;
  roadName: string;
  seq: number;
  distanceKm: number;
  mrtTransfer?: string[];
  fareStage: number;
}

export interface BusRouteDetails {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT Buses' | 'Tower Transit' | 'Go-Ahead Singapore';
  origin: string;
  destination: string;
  direction: 1 | 2;
  firstBusWeekday: string;
  lastBusWeekday: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  loopPoint?: string;
  stops: RouteStopNode[];
}

export interface ServiceAdvisory {
  id: string;
  severity: 'advisory' | 'warning' | 'critical';
  title: string;
  details: string;
  servicesAffected: string[];
  date: string;
  status: 'Active' | 'Scheduled' | 'Resolved';
}

export const MRT_LINE_COLORS: Record<string, { bg: string; text: string; name: string }> = {
  NSL: { bg: '#d42e12', text: '#ffffff', name: 'North South Line' },
  EWL: { bg: '#009645', text: '#ffffff', name: 'East West Line' },
  NEL: { bg: '#791780', text: '#ffffff', name: 'North East Line' },
  CCL: { bg: '#f99e1b', text: '#000000', name: 'Circle Line' },
  DTL: { bg: '#005ec4', text: '#ffffff', name: 'Downtown Line' },
  TEL: { bg: '#9d5b25', text: '#ffffff', name: 'Thomson-East Coast Line' },
};

export const BUS_STOPS_DATABASE: BusStop[] = [
  {
    code: '09048',
    name: 'Orchard Stn / Lucky Plaza',
    road: 'Orchard Road',
    directionDesc: 'Towards Somerset / Dhoby Ghaut',
    mrtConnections: [
      { code: 'NS22', line: 'NSL', color: '#d42e12', name: 'Orchard' },
      { code: 'TE14', line: 'TEL', color: '#9d5b25', name: 'Orchard' },
    ],
    services: ['14', '65', '106', '111', '123', '143', '166', '174', '175', '190', '502', '518'],
    lat: 1.3045,
    lng: 103.8335,
    landmarks: ['Lucky Plaza', 'ION Orchard', 'Wisma Atria', 'Ngee Ann City'],
  },
  {
    code: '08057',
    name: 'Dhoby Ghaut Stn Exit B',
    road: 'Orchard Road',
    directionDesc: 'Towards Bras Basah / City Hall',
    mrtConnections: [
      { code: 'NS24', line: 'NSL', color: '#d42e12', name: 'Dhoby Ghaut' },
      { code: 'NE6', line: 'NEL', color: '#791780', name: 'Dhoby Ghaut' },
      { code: 'CC1', line: 'CCL', color: '#f99e1b', name: 'Dhoby Ghaut' },
    ],
    services: ['7', '14', '16', '36', '65', '106', '111', '124', '162', '166', '174', '175', '190'],
    lat: 1.2991,
    lng: 103.8456,
    landmarks: ['Plaza Singapura', 'The Atrium', 'Istana Park', 'MacDonald House'],
  },
  {
    code: '04121',
    name: 'City Hall Stn Exit B',
    road: 'North Bridge Road',
    directionDesc: 'Towards Clarke Quay / Bugis',
    mrtConnections: [
      { code: 'NS25', line: 'NSL', color: '#d42e12', name: 'City Hall' },
      { code: 'EW13', line: 'EWL', color: '#009645', name: 'City Hall' },
    ],
    services: ['32', '51', '61', '63', '80', '124', '145', '166', '174', '197', '851', '961'],
    lat: 1.2931,
    lng: 103.8524,
    landmarks: ['St Andrew Cathedral', 'Capitol Singapore', 'Raffles City', 'National Gallery'],
  },
  {
    code: '05049',
    name: 'Chinatown Point',
    road: 'New Bridge Road',
    directionDesc: 'Towards Outram Park',
    mrtConnections: [
      { code: 'NE4', line: 'NEL', color: '#791780', name: 'Chinatown' },
      { code: 'DT19', line: 'DTL', color: '#005ec4', name: 'Chinatown' },
    ],
    services: ['2', '12', '33', '54', '143', '147', '190', '851', '961', '970'],
    lat: 1.2852,
    lng: 103.8443,
    landmarks: ['Chinatown Point', 'Hong Lim Complex', 'People’s Park Centre'],
  },
  {
    code: '03031',
    name: 'Raffles Place Stn Exit F',
    road: 'Collyer Quay',
    directionDesc: 'Towards Marina Bay / Shenton Way',
    mrtConnections: [
      { code: 'NS26', line: 'NSL', color: '#d42e12', name: 'Raffles Place' },
      { code: 'EW14', line: 'EWL', color: '#009645', name: 'Raffles Place' },
    ],
    services: ['10', '57', '70', '100', '107', '130', '131', '167', '196'],
    lat: 1.2842,
    lng: 103.8527,
    landmarks: ['Ocean Financial Centre', 'Fullerton Hotel', 'One Raffles Place'],
  },
  {
    code: '01113',
    name: 'Bugis Stn Exit A',
    road: 'Victoria Street',
    directionDesc: 'Towards Jalan Sultan / Kallang',
    mrtConnections: [
      { code: 'EW12', line: 'EWL', color: '#009645', name: 'Bugis' },
      { code: 'DT14', line: 'DTL', color: '#005ec4', name: 'Bugis' },
    ],
    services: ['2', '12', '33', '130', '133', '145', '170', '197', '851', '960', '980'],
    lat: 1.3005,
    lng: 103.8561,
    landmarks: ['Bugis Junction', 'Bugis+', 'National Library', 'Bugis Street Market'],
  },
  {
    code: '14009',
    name: 'HarbourFront Bus Interchange',
    road: 'Seah Im Road',
    directionDesc: 'Interchange Terminal',
    mrtConnections: [
      { code: 'NE1', line: 'NEL', color: '#791780', name: 'HarbourFront' },
      { code: 'CC29', line: 'CCL', color: '#f99e1b', name: 'HarbourFront' },
    ],
    services: ['65', '80', '93', '124', '131', '143', '145', '166', '188', '855', '963'],
    lat: 1.2662,
    lng: 103.8202,
    landmarks: ['VivoCity', 'HarbourFront Centre', 'Sentosa Gateway', 'Mount Faber Cable Car'],
  },
  {
    code: '28009',
    name: 'Jurong East Bus Interchange',
    road: 'Jurong Gateway Road',
    directionDesc: 'Interchange Terminal',
    mrtConnections: [
      { code: 'NS1', line: 'NSL', color: '#d42e12', name: 'Jurong East' },
      { code: 'EW24', line: 'EWL', color: '#009645', name: 'Jurong East' },
    ],
    services: ['49', '51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '333', '334', '335', '506'],
    lat: 1.3338,
    lng: 103.7423,
    landmarks: ['Westgate', 'Jem', 'IMM', 'Ng Teng Fong General Hospital'],
  },
];

export const BUS_ARRIVALS_MOCK: Record<string, BusArrivalInfo[]> = {
  // Orchard Stn / Lucky Plaza (09048)
  '09048': [
    {
      serviceNo: '14',
      operator: 'SBS Transit',
      destination: 'BEDOK INT',
      subDestination: 'via Dhoby Ghaut / Bras Basah / Mountbatten',
      category: 'Trunk',
      firstBus: '05:40',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 0, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 6, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 14, load: 'seats', type: 'SD', wheelchair: true },
      ],
    },
    {
      serviceNo: '65',
      operator: 'SBS Transit',
      destination: 'TAMPINES INT',
      subDestination: 'via Little India / MacPherson / Bedok Reservoir',
      category: 'Trunk',
      firstBus: '05:30',
      lastBus: '23:50',
      nextBuses: [
        { arrivalMinutes: 2, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 9, load: 'crowded', type: 'DD', wheelchair: true },
        { arrivalMinutes: 18, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '106',
      operator: 'Tower Transit',
      destination: 'MARINA CENTRE TER',
      subDestination: 'via Somerset / Raffles Blvd / Suntec City',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:55',
      nextBuses: [
        { arrivalMinutes: 4, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 11, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 22, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '123',
      operator: 'SBS Transit',
      destination: 'BEACH STATION BUS TER',
      subDestination: 'via Havelock / Tiong Bahru / Sentosa',
      category: 'Trunk',
      firstBus: '06:00',
      lastBus: '23:30',
      nextBuses: [
        { arrivalMinutes: 3, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 15, load: 'standing', type: 'SD', wheelchair: true },
        { arrivalMinutes: 27, load: 'seats', type: 'SD', wheelchair: true },
      ],
    },
    {
      serviceNo: '143',
      operator: 'Tower Transit',
      destination: 'TOA PAYOH INT',
      subDestination: 'via Newton / Novena / Thomson Rd',
      category: 'Trunk',
      firstBus: '05:35',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 5, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 13, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 24, load: 'crowded', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '166',
      operator: 'SBS Transit',
      destination: 'ANG MO KIO INT',
      subDestination: 'via Thomson / Bishan Rd / AMK Ave 6',
      category: 'Trunk',
      firstBus: '05:50',
      lastBus: '23:35',
      nextBuses: [
        { arrivalMinutes: 1, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 8, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 19, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '174',
      operator: 'SBS Transit',
      destination: 'NEW BRIDGE RD TER',
      subDestination: 'via Dhoby Ghaut / Clarke Quay / Chinatown',
      category: 'Trunk',
      firstBus: '05:30',
      lastBus: '23:40',
      nextBuses: [
        { arrivalMinutes: 7, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 16, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 25, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '190',
      operator: 'SMRT Buses',
      destination: 'CHOA CHU KANG INT',
      subDestination: 'via Stevens / Whitley / Bukit Panjang / CCK',
      category: 'Express',
      firstBus: '05:45',
      lastBus: '23:55',
      nextBuses: [
        { arrivalMinutes: 2, load: 'crowded', type: 'BD', wheelchair: true },
        { arrivalMinutes: 7, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 15, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '502',
      operator: 'SBS Transit',
      destination: 'SOON LEE BUS PARK',
      subDestination: 'Express via PIE / Jurong East / Pioneer',
      category: 'Express',
      firstBus: '06:15',
      lastBus: '23:15',
      nextBuses: [
        { arrivalMinutes: 12, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 26, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 41, load: 'seats', type: 'SD', wheelchair: true },
      ],
    },
  ],

  // Dhoby Ghaut Stn Exit B (08057)
  '08057': [
    {
      serviceNo: '14',
      operator: 'SBS Transit',
      destination: 'BEDOK INT',
      subDestination: 'via Bras Basah / Suntec / Mountbatten',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:50',
      nextBuses: [
        { arrivalMinutes: 3, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 10, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 18, load: 'seats', type: 'SD', wheelchair: true },
      ],
    },
    {
      serviceNo: '65',
      operator: 'SBS Transit',
      destination: 'TAMPINES INT',
      subDestination: 'via Selegie / Little India / MacPherson',
      category: 'Trunk',
      firstBus: '05:35',
      lastBus: '23:55',
      nextBuses: [
        { arrivalMinutes: 5, load: 'crowded', type: 'DD', wheelchair: true },
        { arrivalMinutes: 12, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 21, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '124',
      operator: 'SBS Transit',
      destination: 'HARBOURFRONT INT',
      subDestination: 'via City Hall / Chinatown / Outram Park',
      category: 'Trunk',
      firstBus: '06:00',
      lastBus: '23:30',
      nextBuses: [
        { arrivalMinutes: 1, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 14, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 25, load: 'standing', type: 'SD', wheelchair: true },
      ],
    },
    {
      serviceNo: '190',
      operator: 'SMRT Buses',
      destination: 'KAMPONG BAHRU TER',
      subDestination: 'via Clarke Quay / Chinatown / Cantonment Rd',
      category: 'Express',
      firstBus: '06:05',
      lastBus: '00:15',
      nextBuses: [
        { arrivalMinutes: 0, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 6, load: 'seats', type: 'BD', wheelchair: true },
        { arrivalMinutes: 16, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // City Hall Stn Exit B (04121)
  '04121': [
    {
      serviceNo: '61',
      operator: 'SMRT Buses',
      destination: 'BUKIT BATOK INT',
      subDestination: 'via Chinatown / Tiong Bahru / Commonwealth / Clementi',
      category: 'Trunk',
      firstBus: '05:40',
      lastBus: '23:35',
      nextBuses: [
        { arrivalMinutes: 2, load: 'seats', type: 'SD', wheelchair: true },
        { arrivalMinutes: 11, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 23, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '145',
      operator: 'SBS Transit',
      destination: 'BUONA VISTA TER',
      subDestination: 'via Clarke Quay / Tanjong Pagar / Telok Blangah',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:40',
      nextBuses: [
        { arrivalMinutes: 0, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 8, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 17, load: 'seats', type: 'SD', wheelchair: true },
      ],
    },
    {
      serviceNo: '166',
      operator: 'SBS Transit',
      destination: 'CLEMENTI INT',
      subDestination: 'via Chinatown / Alexandra / Dover / Clementi',
      category: 'Trunk',
      firstBus: '05:55',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 4, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 13, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 22, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '851',
      operator: 'SBS Transit',
      destination: 'BUKIT MERAH INT',
      subDestination: 'via Clarke Quay / Chinatown / Tiong Bahru',
      category: 'Trunk',
      firstBus: '05:50',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 6, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 15, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 26, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // Chinatown Point (05049)
  '05049': [
    {
      serviceNo: '143',
      operator: 'Tower Transit',
      destination: 'JURONG EAST INT',
      subDestination: 'via Outram / Pasir Panjang / West Coast / Clementi',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:55',
      nextBuses: [
        { arrivalMinutes: 1, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 8, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 16, load: 'crowded', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '147',
      operator: 'SBS Transit',
      destination: 'CLEMENTI INT',
      subDestination: 'via Outram / Bukit Merah / Queensway / Commonwealth',
      category: 'Trunk',
      firstBus: '05:35',
      lastBus: '23:50',
      nextBuses: [
        { arrivalMinutes: 3, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 9, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 18, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '190',
      operator: 'SMRT Buses',
      destination: 'CHOA CHU KANG INT',
      subDestination: 'via Clarke Quay / Orchard / Whitley / Bukit Panjang',
      category: 'Express',
      firstBus: '05:50',
      lastBus: '00:05',
      nextBuses: [
        { arrivalMinutes: 0, load: 'crowded', type: 'DD', wheelchair: true },
        { arrivalMinutes: 5, load: 'standing', type: 'BD', wheelchair: true },
        { arrivalMinutes: 12, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // Bugis Stn Exit A (01113)
  '01113': [
    {
      serviceNo: '2',
      operator: 'Go-Ahead Singapore',
      destination: 'CHANGI VILLAGE TER',
      subDestination: 'via Kallang / Sims Ave / Bedok / Tanah Merah',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:50',
      nextBuses: [
        { arrivalMinutes: 4, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 12, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 20, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '12',
      operator: 'Go-Ahead Singapore',
      destination: 'PASIR RIS INT',
      subDestination: 'via Mountbatten / East Coast / Simei / Pasir Ris',
      category: 'Trunk',
      firstBus: '05:40',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 2, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 10, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 19, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '960',
      operator: 'SMRT Buses',
      destination: 'WOODLANDS INT',
      subDestination: 'Express via BKE / Bukit Panjang / Woodlands Ave 3',
      category: 'Express',
      firstBus: '05:50',
      lastBus: '23:55',
      nextBuses: [
        { arrivalMinutes: 5, load: 'standing', type: 'BD', wheelchair: true },
        { arrivalMinutes: 14, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 26, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // HarbourFront Interchange (14009)
  '14009': [
    {
      serviceNo: '65',
      operator: 'SBS Transit',
      destination: 'TAMPINES INT',
      subDestination: 'via Lower Delta / Orchard / Little India / MacPherson',
      category: 'Trunk',
      firstBus: '05:30',
      lastBus: '23:30',
      nextBuses: [
        { arrivalMinutes: 3, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 11, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 22, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '143',
      operator: 'Tower Transit',
      destination: 'TOA PAYOH INT',
      subDestination: 'via Chinatown / Clarke Quay / Orchard / Novena',
      category: 'Trunk',
      firstBus: '05:40',
      lastBus: '23:35',
      nextBuses: [
        { arrivalMinutes: 6, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 14, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 25, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // Jurong East Interchange (28009)
  '28009': [
    {
      serviceNo: '51',
      operator: 'SBS Transit',
      destination: 'HOUGANG CENTRAL INT',
      subDestination: 'via Clementi / Pasir Panjang / Chinatown / Eunos',
      category: 'Trunk',
      firstBus: '05:30',
      lastBus: '23:15',
      nextBuses: [
        { arrivalMinutes: 2, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 10, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 18, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '143',
      operator: 'Tower Transit',
      destination: 'TOA PAYOH INT',
      subDestination: 'via Clementi / West Coast / Pasir Panjang / Chinatown',
      category: 'Trunk',
      firstBus: '05:40',
      lastBus: '23:30',
      nextBuses: [
        { arrivalMinutes: 5, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 12, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 21, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
  ],

  // Raffles Place (03031)
  '03031': [
    {
      serviceNo: '10',
      operator: 'SBS Transit',
      destination: 'TAMPINES INT',
      subDestination: 'via Nicoll Highway / Old Airport / Bedok South',
      category: 'Trunk',
      firstBus: '05:45',
      lastBus: '23:45',
      nextBuses: [
        { arrivalMinutes: 1, load: 'standing', type: 'DD', wheelchair: true },
        { arrivalMinutes: 9, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 18, load: 'seats', type: 'DD', wheelchair: true },
      ],
    },
    {
      serviceNo: '100',
      operator: 'SBS Transit',
      destination: 'SERANGOON INT',
      subDestination: 'via Beach Rd / Golden Mile / Aljunied / Upper Serangoon',
      category: 'Trunk',
      firstBus: '05:50',
      lastBus: '23:50',
      nextBuses: [
        { arrivalMinutes: 4, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 13, load: 'seats', type: 'DD', wheelchair: true },
        { arrivalMinutes: 24, load: 'standing', type: 'DD', wheelchair: true },
      ],
    },
  ],
};

export const BUS_ROUTES_DATABASE: Record<string, BusRouteDetails> = {
  '147': {
    serviceNo: '147',
    operator: 'SBS Transit',
    origin: 'Hougang Central Bus Interchange',
    destination: 'Clementi Bus Interchange',
    direction: 1,
    firstBusWeekday: '05:30',
    lastBusWeekday: '23:45',
    frequencyPeak: '5 - 8 mins',
    frequencyOffPeak: '8 - 12 mins',
    stops: [
      { stopCode: '64009', stopName: 'Hougang Central Int', roadName: 'Hougang Central', seq: 1, distanceKm: 0.0, mrtTransfer: ['NE14'], fareStage: 1 },
      { stopCode: '64389', stopName: 'Blk 831', roadName: 'Hougang Ave 8', seq: 2, distanceKm: 1.1, fareStage: 2 },
      { stopCode: '63229', stopName: 'Kovan Stn Exit C', roadName: 'Upper Serangoon Rd', seq: 3, distanceKm: 2.5, mrtTransfer: ['NE13'], fareStage: 3 },
      { stopCode: '66181', stopName: 'Serangoon Stn Exit C', roadName: 'Serangoon Central', seq: 4, distanceKm: 4.8, mrtTransfer: ['NE12', 'CC13'], fareStage: 5 },
      { stopCode: '60111', stopName: 'Potong Pasir Stn Exit B', roadName: 'Upper Serangoon Rd', seq: 5, distanceKm: 7.2, mrtTransfer: ['NE10'], fareStage: 7 },
      { stopCode: '60011', stopName: 'Boon Keng Stn Exit C', roadName: 'Serangoon Rd', seq: 6, distanceKm: 9.3, mrtTransfer: ['NE9'], fareStage: 9 },
      { stopCode: '07011', stopName: 'Farrer Park Stn Exit A', roadName: 'Rangoon Rd', seq: 7, distanceKm: 11.0, mrtTransfer: ['NE8'], fareStage: 11 },
      { stopCode: '04159', stopName: 'Clarke Quay Stn Exit E', roadName: 'Eu Tong Sen St', seq: 8, distanceKm: 13.4, mrtTransfer: ['NE5'], fareStage: 13 },
      { stopCode: '05049', stopName: 'Chinatown Point', roadName: 'New Bridge Rd', seq: 9, distanceKm: 14.2, mrtTransfer: ['NE4', 'DT19'], fareStage: 14 },
      { stopCode: '05019', stopName: 'Outram Park Stn Exit 7', roadName: 'Eu Tong Sen St', seq: 10, distanceKm: 15.3, mrtTransfer: ['EW16', 'NE3', 'TE17'], fareStage: 15 },
      { stopCode: '10011', stopName: 'Blk 140', roadName: 'Bukit Merah Central', seq: 11, distanceKm: 17.8, fareStage: 17 },
      { stopCode: '11019', stopName: 'Queenstown Stn Exit A', roadName: 'Commonwealth Ave', seq: 12, distanceKm: 20.4, mrtTransfer: ['EW19'], fareStage: 20 },
      { stopCode: '11169', stopName: 'Commonwealth Stn Exit B', roadName: 'Commonwealth Ave', seq: 13, distanceKm: 22.1, mrtTransfer: ['EW20'], fareStage: 22 },
      { stopCode: '17179', stopName: 'Clementi Stn Exit A', roadName: 'Commonwealth Ave West', seq: 14, distanceKm: 25.3, mrtTransfer: ['EW23'], fareStage: 25 },
      { stopCode: '17009', stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', seq: 15, distanceKm: 26.2, mrtTransfer: ['EW23'], fareStage: 26 },
    ],
  },
  '190': {
    serviceNo: '190',
    operator: 'SMRT Buses',
    origin: 'Choa Chu Kang Bus Interchange',
    destination: 'Kampong Bahru Bus Terminal',
    direction: 1,
    firstBusWeekday: '05:45',
    lastBusWeekday: '23:55',
    frequencyPeak: '4 - 7 mins',
    frequencyOffPeak: '7 - 10 mins',
    stops: [
      { stopCode: '44009', stopName: 'Choa Chu Kang Int', roadName: 'Choa Chu Kang Loop', seq: 1, distanceKm: 0.0, mrtTransfer: ['NS4', 'BP1'], fareStage: 1 },
      { stopCode: '44539', stopName: 'Blk 202', roadName: 'Choa Chu Kang Ave 1', seq: 2, distanceKm: 1.5, fareStage: 2 },
      { stopCode: '44731', stopName: 'Teck Whye Stn', roadName: 'Choa Chu Kang Rd', seq: 3, distanceKm: 2.8, mrtTransfer: ['BP4'], fareStage: 3 },
      { stopCode: '44029', stopName: 'Phoenix Stn', roadName: 'Upper Bukit Timah Rd', seq: 4, distanceKm: 3.9, mrtTransfer: ['BP5'], fareStage: 4 },
      { stopCode: '45029', stopName: 'Bukit Panjang Stn Exit A', roadName: 'Upper Bukit Timah Rd', seq: 5, distanceKm: 4.8, mrtTransfer: ['DT1', 'BP6'], fareStage: 5 },
      { stopCode: '40051', stopName: 'Whitley Rd / Opp Catholic JC', roadName: 'Whitley Rd', seq: 6, distanceKm: 12.3, fareStage: 12 },
      { stopCode: '40081', stopName: 'Stevens Stn Exit 2', roadName: 'Whitley Rd', seq: 7, distanceKm: 14.1, mrtTransfer: ['DT10', 'TE11'], fareStage: 14 },
      { stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', roadName: 'Orchard Rd', seq: 8, distanceKm: 16.5, mrtTransfer: ['NS22', 'TE14'], fareStage: 16 },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn Exit B', roadName: 'Orchard Rd', seq: 9, distanceKm: 18.2, mrtTransfer: ['NS24', 'NE6', 'CC1'], fareStage: 18 },
      { stopCode: '04159', stopName: 'Clarke Quay Stn Exit E', roadName: 'Eu Tong Sen St', seq: 10, distanceKm: 19.8, mrtTransfer: ['NE5'], fareStage: 20 },
      { stopCode: '05049', stopName: 'Chinatown Point', roadName: 'New Bridge Rd', seq: 11, distanceKm: 20.6, mrtTransfer: ['NE4', 'DT19'], fareStage: 21 },
      { stopCode: '05019', stopName: 'Outram Park Stn Exit 7', roadName: 'Eu Tong Sen St', seq: 12, distanceKm: 21.7, mrtTransfer: ['EW16', 'NE3', 'TE17'], fareStage: 22 },
      { stopCode: '10049', stopName: 'Kampong Bahru Bus Ter', roadName: 'Spooner Rd', seq: 13, distanceKm: 23.2, fareStage: 24 },
    ],
  },
  '65': {
    serviceNo: '65',
    operator: 'SBS Transit',
    origin: 'Tampines Bus Interchange',
    destination: 'HarbourFront Bus Interchange',
    direction: 1,
    firstBusWeekday: '05:30',
    lastBusWeekday: '23:30',
    frequencyPeak: '6 - 9 mins',
    frequencyOffPeak: '9 - 13 mins',
    stops: [
      { stopCode: '75009', stopName: 'Tampines Bus Interchange', roadName: 'Tampines Ave 4', seq: 1, distanceKm: 0.0, mrtTransfer: ['EW2', 'DT32'], fareStage: 1 },
      { stopCode: '76141', stopName: 'Bedok Reservoir Stn Exit A', roadName: 'Bedok Reservoir Rd', seq: 2, distanceKm: 3.2, mrtTransfer: ['DT30'], fareStage: 3 },
      { stopCode: '70179', stopName: 'Kaki Bukit Stn Exit B', roadName: 'Kaki Bukit Ave 1', seq: 3, distanceKm: 6.5, mrtTransfer: ['DT28'], fareStage: 6 },
      { stopCode: '70251', stopName: 'MacPherson Stn Exit C', roadName: 'Circuit Rd', seq: 4, distanceKm: 9.8, mrtTransfer: ['CC10', 'DT26'], fareStage: 10 },
      { stopCode: '60011', stopName: 'Boon Keng Stn Exit C', roadName: 'Serangoon Rd', seq: 5, distanceKm: 13.4, mrtTransfer: ['NE9'], fareStage: 13 },
      { stopCode: '07011', stopName: 'Little India Stn Exit E', roadName: 'Bukit Timah Rd', seq: 6, distanceKm: 15.6, mrtTransfer: ['NE7', 'DT12'], fareStage: 15 },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn Exit B', roadName: 'Orchard Rd', seq: 7, distanceKm: 17.5, mrtTransfer: ['NS24', 'NE6', 'CC1'], fareStage: 17 },
      { stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', roadName: 'Orchard Rd', seq: 8, distanceKm: 19.3, mrtTransfer: ['NS22', 'TE14'], fareStage: 19 },
      { stopCode: '10169', stopName: 'Tiong Bahru Plaza', roadName: 'Tiong Bahru Rd', seq: 9, distanceKm: 22.8, mrtTransfer: ['EW17'], fareStage: 23 },
      { stopCode: '14009', stopName: 'HarbourFront Bus Interchange', roadName: 'Seah Im Rd', seq: 10, distanceKm: 27.4, mrtTransfer: ['NE1', 'CC29'], fareStage: 27 },
    ],
  },
  '14': {
    serviceNo: '14',
    operator: 'SBS Transit',
    origin: 'Clementi Bus Interchange',
    destination: 'Bedok Bus Interchange',
    direction: 1,
    firstBusWeekday: '05:40',
    lastBusWeekday: '23:45',
    frequencyPeak: '7 - 10 mins',
    frequencyOffPeak: '10 - 14 mins',
    stops: [
      { stopCode: '17009', stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', seq: 1, distanceKm: 0.0, mrtTransfer: ['EW23'], fareStage: 1 },
      { stopCode: '17129', stopName: 'Dover Stn Exit A', roadName: 'Commonwealth Ave West', seq: 2, distanceKm: 2.1, mrtTransfer: ['EW22'], fareStage: 2 },
      { stopCode: '11389', stopName: 'Buona Vista Stn Exit C', roadName: 'North Buona Vista Rd', seq: 3, distanceKm: 4.3, mrtTransfer: ['EW21', 'CC22'], fareStage: 4 },
      { stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', roadName: 'Orchard Rd', seq: 4, distanceKm: 10.9, mrtTransfer: ['NS22', 'TE14'], fareStage: 11 },
      { stopCode: '08057', stopName: 'Dhoby Ghaut Stn Exit B', roadName: 'Orchard Rd', seq: 5, distanceKm: 12.7, mrtTransfer: ['NS24', 'NE6', 'CC1'], fareStage: 13 },
      { stopCode: '80059', stopName: 'Mountbatten Stn Exit B', roadName: 'Mountbatten Rd', seq: 6, distanceKm: 17.5, mrtTransfer: ['CC7'], fareStage: 17 },
      { stopCode: '84009', stopName: 'Bedok Bus Interchange', roadName: 'Bedok North Ave 1', seq: 7, distanceKm: 24.8, mrtTransfer: ['EW5'], fareStage: 25 },
    ],
  },
};

export const SERVICE_ADVISORIES: ServiceAdvisory[] = [
  {
    id: 'ADV-2026-041',
    severity: 'warning',
    title: 'Bus Diversion: Orchard Road Fashion & Civic Parade',
    details: 'Services 14, 65, 106, 123, 143, 166, 174, 190 will skip bus stops along Orchard Rd (between Scotts Rd and Bencoolen St) on Saturday from 18:00 to 23:59. Passengers are advised to board at Penang Rd or Somerset Stn.',
    servicesAffected: ['14', '65', '106', '123', '143', '166', '174', '190'],
    date: 'Active · Effective this weekend',
    status: 'Active',
  },
  {
    id: 'ADV-2026-039',
    severity: 'advisory',
    title: 'Extended Operating Hours on Public Holiday Eve',
    details: 'All basic trunk bus services originating from Jurong East, Tampines, Bedok, Hougang Central, and Clementi Interchanges will depart up to 01:15 AM to connect with last MRT departures.',
    servicesAffected: ['Trunk Network', 'Feeder Services'],
    date: 'Scheduled · Tomorrow Evening',
    status: 'Scheduled',
  },
  {
    id: 'ADV-2026-035',
    severity: 'advisory',
    title: 'Full Fleet Wheelchair Accessible Bus (WAB) Deployment',
    details: '100% of public bus trips operated by SBS Transit, SMRT Buses, Tower Transit, and Go-Ahead are equipped with step-free motorized or manual boarding ramps.',
    servicesAffected: ['All Public Bus Services'],
    date: 'Permanent Standard',
    status: 'Resolved',
  },
];

// Distance-based card fare calculation (LTA Adult Card Fares in SGD)
export function calculateBusFare(distanceKm: number, passengerType: 'adult' | 'student' | 'senior' | 'workfare' = 'adult'): {
  cardFare: number;
  cashFare: number;
  distanceBracket: string;
} {
  let baseCard = 1.09;
  let cashFare = 1.90;

  if (distanceKm <= 3.2) {
    baseCard = 1.09;
    cashFare = 1.90;
  } else if (distanceKm <= 4.2) {
    baseCard = 1.19;
    cashFare = 2.10;
  } else if (distanceKm <= 5.2) {
    baseCard = 1.29;
    cashFare = 2.20;
  } else if (distanceKm <= 6.2) {
    baseCard = 1.39;
    cashFare = 2.30;
  } else if (distanceKm <= 7.2) {
    baseCard = 1.49;
    cashFare = 2.40;
  } else if (distanceKm <= 8.2) {
    baseCard = 1.57;
    cashFare = 2.50;
  } else if (distanceKm <= 9.2) {
    baseCard = 1.65;
    cashFare = 2.60;
  } else if (distanceKm <= 10.2) {
    baseCard = 1.73;
    cashFare = 2.70;
  } else if (distanceKm <= 15.2) {
    baseCard = 1.92;
    cashFare = 2.90;
  } else if (distanceKm <= 20.2) {
    baseCard = 2.11;
    cashFare = 3.10;
  } else {
    baseCard = 2.37;
    cashFare = 3.30;
  }

  let multiplier = 1.0;
  if (passengerType === 'student') multiplier = 0.48;
  if (passengerType === 'senior') multiplier = 0.62;
  if (passengerType === 'workfare') multiplier = 0.78;

  const cardFare = Math.round(baseCard * multiplier * 100) / 100;
  return {
    cardFare,
    cashFare,
    distanceBracket: `${distanceKm.toFixed(1)} km`,
  };
}
