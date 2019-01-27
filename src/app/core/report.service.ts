import { Injectable } from '@angular/core';
import { CoreModule } from './core.module'
import { AngularFireStorage } from '@angular/fire/storage';
import { Hazard } from './hazard'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { LoadingController } from '@ionic/angular'
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage'


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  privateMode: boolean

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    public loadingController: LoadingController,
    private authService: AuthService,
    private ionicStorage: Storage
  ) {  }

  hazardsCollection: AngularFirestoreCollection<Hazard>
  public hazardsObservable: Observable<Hazard[]>

  getHazards(): Observable<Hazard[]> {
        
    this.hazardsCollection = this.afs.collection('hazards')
    this.hazardsObservable = this.hazardsCollection.valueChanges()

    return this.hazardsObservable

  }

  getPublicHazards(user: any) {

    this.ionicStorage.get('privateMode').then((val) => {
      this.privateMode = val
    })

    if (this.privateMode == true) {
      this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('public', '==', true).where('orgID', '==', user.orgID).orderBy('createdAt', 'desc'))
    } else {
      this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('public', '==', true).orderBy('createdAt', 'desc'))
    }
    
    this.hazardsObservable = this.hazardsCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data()
        const id = snap.payload.doc.id
        return { id, ...data}
      })
    }))

    return this.hazardsObservable
  }

  getHazardsByUser(user: any): Observable<Hazard[]> {
    
    if (this.privateMode == true) {
      this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('userID', '==', user.uid).where('orgID', '==', user.orgID).orderBy('createdAt', 'desc'))
    } else {
      this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('userID', '==', user.uid).orderBy('createdAt', 'desc'))
    }

    this.hazardsObservable = this.hazardsCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data()
        const id = snap.payload.doc.id
        return { id, ...data}
      })
    }))

    return this.hazardsObservable

  }

  getMode() {

    let promise = new Promise((resolve, reject) => {
      this.ionicStorage.get('privateMode').then((val) => {
        this.privateMode = val
        console.log(val)
        resolve()
      }).catch(err => {
        reject()
      })
    })
    
    return promise

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
