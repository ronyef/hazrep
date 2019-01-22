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

  updateProfile(name: string, photoUrl: string): Promise<void> {
    return this.afAuth.auth.currentUser.updateProfile({displayName: name, photoURL: photoUrl})
  }

  updatePhone(phone: any) {
    return this.afAuth.auth.currentUser.updatePhoneNumber(phone)
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
