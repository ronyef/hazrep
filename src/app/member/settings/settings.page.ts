import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  currentUser: any
  image: string
  uploadTask: AngularFireUploadTask
  imageUrl: string
  user: User

  usersCollection: AngularFirestoreCollection<any>
  usersObservable: Observable<any[]>

  constructor(
    private router: Router,
    private authService: AuthService,
    private camera: Camera,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    // this.currentUser = this.authService.getCurrentUser()
    this.authService.getUserDoc().subscribe(user => {
      this.user = user
      console.log(user)
    })
  }

  ionViewWillEnter() {
    this.authService.getUserDoc().subscribe(user => {
      this.user = user
      console.log(user)
    })
  }

  onLogout() {

    this.authService.logOut().then(() => {
      this.router.navigate(['login'])
    }).catch(err => console.log(err))

  }

  goReport() {
    this.router.navigate(['/member/report'])
  }

  takePicture() {

    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image) => {

      this.image = "data:image/png;base64," + base64Image

      this.uploadPicture(this.user.uid).then(snapshot => {

        console.log(snapshot)
        this.presentToast('Photo was uploaded.')

        this.storage.ref('users/userPhoto' + this.user.uid).getDownloadURL().subscribe((url) => {
          this.imageUrl = url

          const userDoc = this.afs.doc(`users/${this.user.uid}`)

          userDoc.set({photoURL: this.imageUrl}, {merge: true}).then(() => {
            this.presentToast('PhotoURL updated.')
          }).catch(err => {
            this.presentToast(err.message)
          })

        })

      })

    }).catch(err => console.log(err))
  }

  uploadPicture(name: string) {

    const path = 'users/userPhoto' + name

    return this.uploadTask = this.storage.ref(path).putString(this.image.split(',')[1], "base64")

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg
    });
    await loading.present();
  }

  async changeNameAlertPrompt(name) {
    const alert = await this.alertController.create({
      header: 'Change Display Name!',
      inputs: [
        {
          name: 'userName',
          type: 'text',
          placeholder: 'Enter new name!'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('canceled');
            name.close()
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            this.authService.updateDisplayName(data.userName).then(() => {
              name.close()
            }).catch(err => console.log(err))
          }
        }
      ]
    });
  
    await alert.present();
  }

  async changeOrgAlertPrompt(org) {
    const alert = await this.alertController.create({
      header: 'Change Organization!',
      inputs: [
        {
          name: 'orgID',
          type: 'text',
          placeholder: 'Enter ID!'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('canceled');
            org.close()
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            // this.authService.updateDisplayName(data.userName).then(() => {
            //   org.close()
            // }).catch(err => console.log(err))
          }
        }
      ]
    });
  
    await alert.present();
  }

  // async changePhoneAlertPrompt(phone) {
  //   const alert = await this.alertController.create({
  //     header: 'Change Phone Number!',
  //     inputs: [
  //       {
  //         name: 'phone',
  //         type: 'text',
  //         placeholder: 'Enter new phone!'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (data) => {
  //           console.log('canceled');
  //           phone.close()
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: (data) => {
  //           this.authService.updatePhone(data.phone).then(() => {
  //             phone.close()
  //           }).catch(err => console.log(err))
  //         }
  //       }
  //     ]
  //   });
  
  //   await alert.present();
  // }

}
