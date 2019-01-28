import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app'

//init firebase
// import { environment } from '../../environments/environment'
// firebase.initializeApp(environment.firebase)
import { environment } from '../../environments/environment.prod'

//Init GeoFireX
import * as geofirex from 'geofirex'
import { Observable } from 'rxjs';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Hazard } from './hazard';
import { Storage } from '@ionic/storage'

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  geo = geofirex.init(firebase)
  points: Observable<any[]>
  nearbyHazards: Observable<any[]>

  lat: number
  lng: number

  privateMode: boolean

  constructor(
    private geoLocation: Geolocation,
    private ionicStorage: Storage
  ) { 
    this.getCurrentLocation()
  }

  setPoint(id: string, lat: number, lng: number) {

    const collection = this.geo.collection('hazards')

    return collection.setPoint(id, 'position', lat, lng)

  }

  getMode() {

    let promise = new Promise((resolve, reject) => {
      this.ionicStorage.get('privateMode').then((val) => {
        this.privateMode = val
        console.log(val)
        resolve(val)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })

    return promise    

  }

  getPublicHazards(user: any, radius: number) {

    let promise = new Promise((resolve, reject) => {

      this.getMode().then((val) => {

        let publicHazards: any
  
        if(val == true) {
          publicHazards = this.geo.collection('hazards', ref => ref.where('public', '==', true).where('orgID', '==', user.orgID))
        } else {
          publicHazards = this.geo.collection('hazards', ref => ref.where('public', '==', true).where('orgID', '==', null))
        }
  
        this.getCurrentLocation().then((resp: Geoposition) => {
  
          const center = this.geo.point(resp.coords.latitude, resp.coords.longitude)
  
          this.nearbyHazards = publicHazards.within(center, radius, 'position')

          resolve(this.nearbyHazards)

        })
         
      }).catch(err => reject(err))

    })

    return promise

  }

  getCurrentLocation() {

    let promise = new Promise((resolve, reject) => {
      this.geoLocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude
        this.lng = resp.coords.longitude
        resolve(resp)
      }).catch(err => {
        reject(err)
      })
    })

    return promise

  }

}
