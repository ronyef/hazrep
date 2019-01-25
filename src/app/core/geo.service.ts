import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app'

//init firebase
import { environment } from '../../environments/environment'
// firebase.initializeApp(environment.firebase)

//Init GeoFireX
import * as geofirex from 'geofirex'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  geo = geofirex.init(firebase)
  points: Observable<any[]>

  constructor() { }

  setPoint(id: string, lat: number, lng: number) {

    const collection = this.geo.collection('hazards')

    return collection.setPoint(id, 'position', lat, lng)

  }

}
