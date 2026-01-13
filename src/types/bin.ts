interface Location {
  includes: any
  lat: number
  lng: number
}

export interface Bin {
  _id: string
  binCode: string
  location: Location
  area: string
  fillLevel: number
  status: 'EMPTY' | 'HALF' | 'FULL'
  fullCount: number
  pictureBins: string[]
  addressBin: string
}
