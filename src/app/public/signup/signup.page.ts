import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular";
import { AngularFirestore } from '@angular/fire/firestore'


export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phoneNumber: string
  emailVerified: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  email: string
  password: string
  name: string

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  signup() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(credential => { 

        this.afAuth.auth.currentUser.updateProfile({
          displayName: this.name,
          photoURL: ''
        }).then(() => {
          console.log('DisplayName updated')
          this.saveUser()
        }).catch(err => console.log(err))

        this.presentToast('User has been created.')
        this.router.navigate(['/member'])
        
      }).catch(err => {
        console.log(err)
        this.presentToast(err.message)
      })
  }

  saveUser() {
    console.log(this.afAuth.auth.currentUser)
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

    usersCollection.add(newUser).then((doc) => {
      console.log('Users data added: ' + doc)
    }).catch(err => console.log(err))
    
  }

}
