import { Injectable } from '@angular/core';
import { CoreModule } from './core.module'
import { AngularFireStorage } from '@angular/fire/storage';
import { Hazard } from './hazard'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  hazardsCollection: AngularFirestoreCollection<Hazard>
  hazardsObservable: Observable<Hazard[]>

  getHazards(): Observable<Hazard[]> {
        
    this.hazardsCollection = this.afs.collection('hazards')
    this.hazardsObservable = this.hazardsCollection.valueChanges()

    return this.hazardsObservable

  }

  getHazardsByUser(): Observable<Hazard[]> {
    
    const user = this.afAuth.auth.currentUser.uid

    this.hazardsCollection = this.afs.collection('hazards', ref => ref.where('userID', '==', user))
    this.hazardsObservable = this.hazardsCollection.valueChanges()

    return this.hazardsObservable

  }
}
