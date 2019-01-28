import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  onDismiss() {
    this.modalController.dismiss()
  }
}
