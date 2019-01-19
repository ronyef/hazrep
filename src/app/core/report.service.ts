import { Injectable } from '@angular/core';
import { CoreModule } from './core.module'
import { AngularFireStorage } from '@angular/fire/storage';
import { Hazard } from './hazard'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { LoadingController } from '@ionic/angular'

// import 'rxjs/add/operator/map'
import * as moment from 'moment'
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  loading: any

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    public loadingController: LoadingController
  ) { }

  hazardsCollection: AngularFirestoreCollection<Hazard>
  hazardsObservable: Observable<Hazard[]>

  getHazards(): Observable<Hazard[]> {
        
    this.hazardsCollection = this.afs.collection('hazards')
    this.hazardsObservable = this.hazardsCollection.valueChanges()

    return this.hazardsObservable

  }

  getPublicHazards() {
    
    this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('public', '==', true).orderBy('createdAt', 'desc'))
    this.hazardsObservable = this.hazardsCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data()
        const id = snap.payload.doc.id
        return { id, ...data}
      })
    }))

    return this.hazardsObservable
  }

  getHazardsByUser(): Observable<Hazard[]> {
    
    const user = this.afAuth.auth.currentUser.uid

    this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('userID', '==', user).orderBy('createdAt', 'desc'))
    this.hazardsObservable = this.hazardsCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data()
        const id = snap.payload.doc.id
        return { id, ...data}
      })
    }))

    return this.hazardsObservable

  }

  publishHazard(hazard: Hazard) {

    let promise = new Promise((resolve, reject) => {
      const hazardDoc = this.afs.doc(`hazards/${hazard.id}`)

      hazardDoc.set({ public: true }, { merge: true }).then(res => {
        resolve()
      }).catch(err => {
        console.log(err)
        reject()
      })
    }) 

    return promise

  }

}
