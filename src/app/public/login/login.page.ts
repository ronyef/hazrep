import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string
  password: string

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    await toast.present()
  }

  login() {

    return this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(async credential => {
      
      console.log(credential)
      await this.presentToast(`Welcome ${credential.user.displayName}!`)

      this.router.navigate(['member'])

    }).catch(err => {

      console.log(err)
      this.presentToast(err.message)

    })

  }

}
