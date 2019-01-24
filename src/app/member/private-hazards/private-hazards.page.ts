import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { Observable } from 'rxjs'

import { Hazard } from '../../core/hazard';
import { ReportService } from '../../core/report.service'
import { AuthService } from 'src/app/core/auth.service';


@Component({
  selector: 'app-private-hazards',
  templateUrl: './private-hazards.page.html',
  styleUrls: ['./private-hazards.page.scss'],
})
export class PrivateHazardsPage implements OnInit {

  hazards: Hazard[]

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private reportSvc: ReportService,
    private authSvc: AuthService)
  { }

  ngOnInit() {
    this.getHazards()
  }

  ionViewWillEnter() {
    this.getHazards()
  }

  getHazards() {
    this.reportSvc.getHazardsByUser().subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
    })
  }

  onLogout() {
    this.authSvc.logOut().then(() => {
      this.router.navigate(['login'])
    }).catch((err) => {
      console.log(err)
    })
  }

  goReport() {
    this.router.navigate(['/member/report'])
  }

  doRefresh(event) {
    this.reportSvc.getHazardsByUser().subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
      event.target.complete()
    })
  }

}
