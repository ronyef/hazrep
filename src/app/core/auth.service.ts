import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase'
import { User } from './user';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  saveUserToDB() {

    const currentUser = this.afAuth.auth.currentUser
    const usersCollection = this.afs.collection('users')

    const newUser: User = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: '',
      phoneNumber: '',
      emailVerified: false
    }

    return usersCollection.add(newUser)

  }

}
