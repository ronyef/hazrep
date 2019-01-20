import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  currentUser: any
  image: string
  uploadTask: AngularFireUploadTask

  constructor(
    private router: Router,
    private authService: AuthService,
    private camera: Camera,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    // this.currentUser = this.authService.getCurrentUser()
  }

  ionViewWillEnter() {
    this.currentUser = this.authService.getCurrentUser()
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

      this.uploadPicture(this.currentUser.uid).then(snapshot => {

        console.log(snapshot)

        //todo

      })

    }).catch(err => console.log(err))
  }

  uploadPicture(name: string) {

    const path = 'users/userPhoto' + name

    return this.uploadTask = this.storage.ref(path).putString(this.image.split(',')[1], "base64")

  }

}
