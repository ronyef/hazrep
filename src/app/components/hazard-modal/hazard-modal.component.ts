import { Component, OnInit, Input } from '@angular/core';
import { Hazard } from 'src/app/core/hazard';
import { ModalController, ToastController } from '@ionic/angular';
import { ReportService } from 'src/app/core/report.service';

@Component({
  selector: 'app-hazard-modal',
  templateUrl: './hazard-modal.component.html',
  styleUrls: ['./hazard-modal.component.scss']
})
export class HazardModalComponent implements OnInit {

  @Input() hazard: any

  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 17;

  isPublished: boolean

  constructor(
    private modalCtrl: ModalController, 
    private reportSvc: ReportService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    
  }

  onDismiss() {
    this.modalCtrl.dismiss()
  }

  onPublish(hazard: Hazard) {
    this.reportSvc.publishHazard(hazard).then((res) => {
      this.presentToast('Your report has been published.')
    }).catch(err => {
      this.presentToast('Error occured.')
    })
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
