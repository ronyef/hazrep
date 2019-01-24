import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase'
import { User } from './user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface Organization {
  id: string
  name: string
  verified?: boolean
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDocument: AngularFirestoreDocument<User>
  userObservable: Observable<User>

  orgsCollection: AngularFirestoreCollection<Organization>
  orgsObservable: Observable<Organization[]>

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  loginWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  }

  logOut() {
    return this.afAuth.auth.signOut()
  }

  signupWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  getCurrentUser(): firebase.User {
    return this.afAuth.auth.currentUser
  }

  async updateDisplayName(name: string): Promise<void> {
    return this.afAuth.auth.currentUser.updateProfile({displayName: name, photoURL: this.afAuth.auth.currentUser.photoURL}).then(() => {
      const userDoc = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)

      userDoc.set({ displayName: name }, { merge: true })
    })
  }

  updateProfile(name: string) {
    return this.afAuth.auth.currentUser.updateProfile({displayName: name, photoURL: this.afAuth.auth.currentUser.photoURL})
  }

  // updatePhone(phone: any) {
  //   return this.afAuth.auth.currentUser.updatePhoneNumber(phone).then(() => {
  //     const userDoc = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)

  //     userDoc.set({ phoneNumber: phone }, { merge: true })
  //   })
  // }

  getOrgs(): Observable<Organization[]> {
    this.orgsCollection = this.afs.collection('organizations')
    this.orgsObservable = this.orgsCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data()
        const id = snap.payload.doc.id
        return { id, ...data }
      })
    }))
    return this.orgsObservable
  }

  saveDisplayNameToDB(name: string) {
    const userDoc = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)

    userDoc.set({ displayName: name }, { merge: true })
  }

  saveUserToDB() {

    const currentUser = this.afAuth.auth.currentUser
    const usersCollection = this.afs.collection('users').doc(currentUser.uid)

    const newUser: User = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: '',
      phoneNumber: '',
      emailVerified: false
    }

    return usersCollection.set(newUser)

  }

  getUserDoc() {

    this.userDocument = this.afs.doc('users/' + this.getCurrentUser().uid)

    return this.userObservable = this.userDocument.valueChanges()
    
  }

  saveOrg(org: any) {

    const userDoc = this.afs.doc(`users/${this.getCurrentUser().uid}`)

    return userDoc.set(org, {merge: true})

  }

}
