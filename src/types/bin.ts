export interface LocalizedString {
  en: string;
  kh?: string; // Optional because the backend might auto-generate it
}

interface Location {
  includes: any
  lat: number
  lng: number
}

export interface Bin {
  _id: string;
  binCode: string;
  // Notice these are objects now, not strings
  area: LocalizedString; 
  addressBin: LocalizedString;
  location: Location;
  status: 'EMPTY' | 'HALF' | 'FULL';
  fillLevel: number;
  fullCount: number;
  pictureBins?: string[];
}
