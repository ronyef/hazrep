import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
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
    public loadingController: LoadingController
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

}
