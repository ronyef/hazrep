import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app'

//init firebase
import { environment } from '../../environments/environment'
// firebase.initializeApp(environment.firebase)

//Init GeoFireX
import * as geofirex from 'geofirex'
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Hazard } from './hazard';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  geo = geofirex.init(firebase)
  points: Observable<any[]>

  lat: number
  lng: number

  constructor(
    private geoLocation: Geolocation
  ) { 
    this.getCurrentLocation()
  }

  setPoint(id: string, lat: number, lng: number) {

    const collection = this.geo.collection('hazards')

    return collection.setPoint(id, 'position', lat, lng)

  }

  getPublicHazards(user: any, radius: number): Observable<any> {

    const publicHazards = this.geo.collection('hazards', ref => ref.where('public', '==', true))
    
    this.getCurrentLocation()

    const center = this.geo.point(this.lat, this.lng)

    let nearbyHazards: Observable<any> = publicHazards.within(center, radius, 'position')
    
    return nearbyHazards

  }

  async getCurrentLocation() {

    let lat: number
    let lng: number

    await this.geoLocation.getCurrentPosition().then((resp) => {
      lat = resp.coords.latitude
      lng = resp.coords.longitude
    })

    this.lat = lat
    this.lng = lng

  }

}
