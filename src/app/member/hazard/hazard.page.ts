import { Component, OnInit, Input } from '@angular/core';
import { Hazard } from 'src/app/core/hazard';

@Component({
  selector: 'hazard-page',
  templateUrl: './hazard.page.html',
  styleUrls: ['./hazard.page.scss'],
})
export class HazardPage implements OnInit {

  @Input() hazard: Hazard

  constructor() { }

  ngOnInit() {
  }

}
