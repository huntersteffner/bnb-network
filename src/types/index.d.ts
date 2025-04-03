import { DocumentData } from 'firebase/firestore'

export interface Listing {
  data: ListingData | DocumentData
  id: string
}

export interface ListingData {
  bathrooms: string
  bedrooms: string
  food: boolean
  geolocation: GeoLocation
  hostPresent: boolean
  imgUrls: string[]
  latitude: number
  location: string
  longitude: number
  name: string
  price: string
  timestamp: Timestamp
  type: string
  userRef: string
}

export interface GeoLocation {
  lat: number
  lng: number
}

export interface Timestamp {
  nanoseconds: number
  seconds: number
}