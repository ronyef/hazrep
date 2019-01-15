import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { Observable } from 'rxjs'

import { Hazard } from '../report/report.page';
import { ReportService } from '../../core/report.service'


@Component({
  selector: 'app-private-hazards',
  templateUrl: './private-hazards.page.html',
  styleUrls: ['./private-hazards.page.scss'],
})
export class PrivateHazardsPage implements OnInit {

  hazards: Observable<Hazard[]>

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private reportSvc: ReportService)
  { }

  ngOnInit() {
    this.reportSvc.getHazardsByUser().subscribe((hazard) => {
      console.log(hazard)
    })
  }

  onLogout() {
    this.afAuth.auth.signOut()
  }

  goReport() {
    this.router.navigate(['/member/report'])
  }

}
