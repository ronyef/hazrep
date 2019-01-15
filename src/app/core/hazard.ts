export interface Hazard {
    userID: string
    userName: string
    description: string
    level: string
    risk: string
    location: firebase.firestore.GeoPoint
    createdAt: firebase.firestore.FieldValue
    rectified: boolean
  }