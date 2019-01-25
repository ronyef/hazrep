import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { ToastController, AlertController, LoadingController } from '@ionic/angular'

import * as firebase from 'firebase'
import { Observable, from } from 'rxjs';

import { Hazard } from '../../core/hazard'
import { GeoService } from 'src/app/core/geo.service';
import { AuthService } from 'src/app/core/auth.service';


// export interface Hazard {
//   userID: string
//   userName: string
//   description: string
//   level: string
//   risk: string
//   location: firebase.firestore.GeoPoint
//   createdAt: firebase.firestore.FieldValue
//   rectified: boolean
// }

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  userID: string = ''
  userName: string
  description: string
  risk: string
  image: string = null
  rectified: boolean = false
  level: string = 'medium'
  orgID: string

  uploadTask: AngularFireUploadTask
  uploadPercentage: Observable<number>
  snapshot: Observable<any>
  // downloadUrl: Observable<string>
  imageUrl: string

  lat: number
  lng: number

  constructor(
    private camera: Camera, 
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private geolocation: Geolocation,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private geoService: GeoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.geopoint()

    this.userID = this.afAuth.auth.currentUser.uid
    this.userName = this.afAuth.auth.currentUser.displayName

    this.authService.getUserDoc().subscribe(doc => {
      this.orgID = doc.orgID
    })
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
    }).catch(err => console.log(err))
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    })
    await toast.present()
  }

  onSubmit() {
    const hazardsCollection = this.afs.collection('hazards')

    const newHazard: Hazard = {
      userID: this.userID,
      userName: this.userName,
      description: this.description,
      level: this.level,
      risk: this.risk,
      // location: new firebase.firestore.GeoPoint(this.lat, this.lng),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      rectified: false,
      public: false,
      orgID: this.orgID
    }

    this.presentLoading('Posting...')

    hazardsCollection.add(newHazard).then(async (doc) => {
      // console.log('Send hazard success', doc)
      this.loadingController.dismiss()
      this.presentToast('Hazard report submitted.')

      //set geohash to position field
      this.geoService.setPoint(doc.id, this.lat, this.lng).then(() => {
        console.log('Geohash created')
      }).catch(err => console.log(err.message))

      if (this.image) {
        this.presentLoading('uploading image...')
        await this.uploadImage(doc.id).then((snap) => {
          // console.log('Upload sukses', snap)
          this.loadingController.dismiss()
          this.presentToast('Image uploaded')

          this.storage.ref('hazards/hazardImage' + doc.id).getDownloadURL().subscribe((url) => {
            this.imageUrl = url

            const hazardDoc = this.afs.doc(`hazards/${doc.id}`)
            hazardDoc.set({ imageUrl: this.imageUrl }, {merge: true }).then((val) => {
              // this.presentAlert('Update database sukses!')
            }).catch((err) => {
              this.presentAlert(err.message)
            })
          })

        }).catch(err => {
          console.log(err)
          this.presentToast(err.message)
        })
      }  
      this.router.navigate(['member', 'tabs', 'private'])
    }).catch(err => this.presentToast(err.message))
  }

  async geopoint() {
    let lat: number
    let lng: number

    await this.geolocation.getCurrentPosition().then((resp) => {
      lat = resp.coords.latitude
      lng = resp.coords.longitude
    })

    this.lat = lat
    this.lng = lng

    console.log(new firebase.firestore.GeoPoint(lat, lng))
  }

  uploadImage(name: string): AngularFireUploadTask {
    const path = 'hazards/hazardImage' + name

    return this.uploadTask = this.storage.ref(path).putString(this.image.split(',')[1], "base64")

    // this.uploadPercentage = this.uploadTask.percentageChanges()

  }

  riskSelected(event: any) {
    this.level = event.detail.value
    console.log(this.level)
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      message: msg
    })
    await alert.present()
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }

}
