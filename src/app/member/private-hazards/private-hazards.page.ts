import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { Observable } from 'rxjs'

import { Hazard } from '../../core/hazard';
import { ReportService } from '../../core/report.service'
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/core/user';


@Component({
  selector: 'app-private-hazards',
  templateUrl: './private-hazards.page.html',
  styleUrls: ['./private-hazards.page.scss'],
})
export class PrivateHazardsPage implements OnInit {

  hazards: Hazard[]
  user: any

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private reportSvc: ReportService,
    private authSvc: AuthService,
    private zone: NgZone)
  { }

  ngOnInit() {
    this.authSvc.getUser().then(data => {
      this.user = data
      this.getHazards()
    })
  }

  ionViewWillEnter() {
    this.getHazards()
  }

  getHazards() {
    
    this.reportSvc.getMode().then((val) => {
      this.reportSvc.getHazardsByUser(this.user).subscribe((hazards) => {
        console.log(hazards)
        this.hazards = hazards
  
        this.zone.run(async () => {
          this.router.navigate(['member','tabs','private'])
        })
      })
    }).catch(err => console.log(err))
    
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
    this.reportSvc.getHazardsByUser(this.user).subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
      event.target.complete()
    })
  }

}
