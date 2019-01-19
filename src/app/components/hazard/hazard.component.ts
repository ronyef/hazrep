import { Component, OnInit, Input } from '@angular/core';
import { Hazard } from 'src/app/core/hazard';
import * as moment from 'moment'
import { ModalController } from '@ionic/angular';
import { HazardPage } from '../../member/hazard/hazard.page'
import { HazardModalComponent } from '../hazard-modal/hazard-modal.component'


@Component({
  selector: 'app-hazard',
  templateUrl: './hazard.component.html',
  styleUrls: ['./hazard.component.scss']
})
export class HazardComponent implements OnInit {

  @Input()
  hazard: Hazard

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ago(time) {
    let difference = moment(time).diff(moment())
    return moment.duration(difference).humanize()
  }

  async showHazard(hazard: Hazard) {
    const modal = await this.modalCtrl.create({
      component: HazardModalComponent,
      componentProps: { hazard: hazard }
    })
    return await modal.present()
  }

}
