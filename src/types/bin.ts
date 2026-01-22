export interface LocalizedString {
  en: string
  kh?: string
}

interface Location {
  includes: any
  lat: number
  lng: number
}

export interface Bin {
  _id: string
  binCode: string
  area: LocalizedString
  addressBin: LocalizedString
  location: Location
  status: 'EMPTY' | 'HALF' | 'FULL'
  fillLevel: number
  fullCount: number
  pictureBins?: string[]
}
