import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { ToastController } from '@ionic/angular'

import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';


export interface Hazard {
  userID: string
  userName: string
  description: string
  level: string
  risk: string
  location: firebase.firestore.GeoPoint
  createdAt: firebase.firestore.FieldValue
  rectified: boolean
}

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
    private router: Router
  ) { }

  ngOnInit() {
    this.geopoint()

    this.userID = this.afAuth.auth.currentUser.uid
    this.userName = this.afAuth.auth.currentUser.displayName
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
      location: new firebase.firestore.GeoPoint(this.lat, this.lng),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      rectified: false
    }

    hazardsCollection.add(newHazard).then(async (doc) => {
      // console.log('Send hazard success', doc)
      this.presentToast('Hazard report submitted.')

      if (this.image) {
        await this.uploadImage(doc.id).then((snap) => {
          console.log('Upload sukes', snap)
          this.presentToast('Image uploaded')
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
    const path = 'hazardImages' + name

    return this.uploadTask = this.storage.upload(path, this.image)

    this.uploadPercentage = this.uploadTask.percentageChanges()

    this.snapshot = this.uploadTask.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          console.log('Transfer complete')
        }
      }),
      finalize(() => {
        this.storage.ref(path).getDownloadURL().subscribe(url => {
          this.imageUrl = url
        })
      })
    )


  }

  riskSelected(event: any) {
    this.level = event.detail.value
    console.log(this.level)
  }

}
