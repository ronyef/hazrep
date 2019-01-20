import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular";
import { AuthService } from 'src/app/core/auth.service';


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
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
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
    this.authService.signupWithEmail(this.email, this.password)
      .then(credential => { 

        this.authService.updateProfile(this.name, '').then(() => {

          console.log('DisplayName updated')
          
          this.authService.saveUserToDB().then((doc) => {
            this.presentToast(`User has been created.`)
            this.router.navigate(['/member'])
          }).catch(err => console.log(err))

        }).catch(err => console.log(err))

      }).catch(err => {

        console.log(err)
        this.presentToast(err.message)

      })
  }

}
