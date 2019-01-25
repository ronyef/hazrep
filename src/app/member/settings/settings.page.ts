import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Organization } from 'src/app/core/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user';
import { Storage } from '@ionic/storage'

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
  privateMode: boolean

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
    public alertController: AlertController,
    private ionicStorage: Storage
  ) { }

  ngOnInit() {
    
    this.authService.getUserDoc().subscribe(user => {
      this.user = user
    })

    this.ionicStorage.get('privateMode').then((val) => {
      this.privateMode = val
    })

  }

  ionViewWillEnter() {

    this.authService.getUserDoc().subscribe(user => {
      this.user = user
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
            this.authService.getOrgs().subscribe((val) => {
    
              let selectedOrg = val.map((org) => { return org}).filter(org => org.id == data.orgID)

              if (selectedOrg.length > 0) {
                // const organization = selectedOrg[0]
                const selectedOrganization = {
                  orgID: selectedOrg[0].id,
                  orgName: selectedOrg[0].name
                }
                console.log(selectedOrganization)
                
                this.authService.saveOrg(selectedOrganization).then(() => {
                  this.presentToast('Organization has been set!')
                  org.close()
                }).catch(err => {
                  this.presentToast(err.message)
                })
                
              } else {
                this.presentToast('No organization found!')
                org.close()
              }              
              
            })
            
          }
        }
      ]
    });
  
    await alert.present();
  }

  async confirmDeleteOrg(org) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Sure to <strong>delete</strong> organization?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            org.close()
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.authService.deleteOrg().then(() => {
              this.presentToast('You have been removed from organization.')
              org.close()
            }).catch(err => console.log(err.message))
            
          }
        }
      ]
    });
    await alert.present()
  }

  privateModeChanged(toggle) {

    if (this.privateMode == true && this.user.orgID != null) {

      this.presentToast("Private mode active.")
      toggle.checked = true

      this.ionicStorage.set('privateMode', true)
      this.privateMode = true

    } else if (this.privateMode == true && this.user.orgID == null) {

      this.presentToast("You don't have an organization!")
      toggle.checked = false

      this.ionicStorage.set('privateMode', false)
      this.privateMode = false

    } else {

      console.log('false')
      toggle.checked = false

      this.ionicStorage.set('privateMode', false)
      this.privateMode = false

    }
  }


}
