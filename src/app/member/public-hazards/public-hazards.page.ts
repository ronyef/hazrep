import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Hazard } from 'src/app/core/hazard';
import { ReportService } from 'src/app/core/report.service';

@Component({
  selector: 'app-public-hazards',
  templateUrl: './public-hazards.page.html',
  styleUrls: ['./public-hazards.page.scss'],
})
export class PublicHazardsPage implements OnInit {

  hazards: Hazard[]

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private reportSvc: ReportService
  ) { }

  ngOnInit() {
    this.reportSvc.getPublicHazards().subscribe((hazards) => {
      this.hazards = hazards
    })
  }

  onLogout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login'])
    })
  }

  goReport() {
    this.router.navigate(['/member/report'])
  }

  doRefresh(event) {
    this.reportSvc.getPublicHazards().subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
      event.target.complete()
    })
  }

}
