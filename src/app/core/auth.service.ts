import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase'
import { User } from './user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDocument: AngularFirestoreDocument<User>
  userObservable: Observable<User>

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

  // updatePhone(phone: any) {
  //   return this.afAuth.auth.currentUser.updatePhoneNumber(phone).then(() => {
  //     const userDoc = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)

  //     userDoc.set({ phoneNumber: phone }, { merge: true })
  //   })
  // }

  changeOrg(id: string) {

    //ambil list orgs
    //periksa apakah org ada
    //jika ada simpan id ke user profile
    //jika tidak ada reject

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

}
