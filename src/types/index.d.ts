import { Auth, User, UserMetadata } from 'firebase/auth'
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

export interface ProfileAuth extends Auth {
  currentUser: User
}

export interface CurrentUser extends User {
  accessToken: string
  auth: Auth
  displayName: string | null
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  metadata: UserMetadata 
  phoneNumber: string
  photoURL: string
  proactiveRefresh: {
    errorBackoff: number
    isRunning: boolean
    timerId: number
  }
  providerData: any
  providerId: string
  reloadListener: any
  reloadUserInfo: any
  stsTokenManager: any 
  tenantId: string
  uid: string
}

export interface History {
  data: HistoryData | DocumentData
  id: string
}

export interface HistoryData {
  customerId: string
  image: string
  locationAddress: string
  locationDates: string
  locationId: string
  locationName: string
  ownerId: string
  timestamp: Timestamp
  type: string
}