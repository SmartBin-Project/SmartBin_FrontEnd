export interface Bin {
  binCode: string
  area: string
  location: {
    lat: number
    lng: number
  }
  fillLevel: number
  status: 'empty' | 'half-full' | 'full'
}
