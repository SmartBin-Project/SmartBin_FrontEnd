interface Location {
  lat: number;
  lng: number;
}

export interface Bin {
  _id: number;
  binCode: string;
  location: Location;
  fillLevel: number;
  status: string;
}
