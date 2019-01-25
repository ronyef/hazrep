import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hazard } from 'src/app/core/hazard';
import { ReportService } from 'src/app/core/report.service';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/core/user';

@Component({
  selector: 'app-public-hazards',
  templateUrl: './public-hazards.page.html',
  styleUrls: ['./public-hazards.page.scss'],
})
export class PublicHazardsPage implements OnInit {

  hazards: Hazard[]
  user: any

  constructor(
    private authService: AuthService, 
    private router: Router,
    private reportSvc: ReportService
  ) { }

  ngOnInit() {

    this.authService.getUser().then((user) => {
      this.user = user
      this.getPublicHazards(this.user)
    })
    
  }

  ionViewWillEnter() {
    this.getPublicHazards(this.user)
  }

  getPublicHazards(user: any) {
    this.reportSvc.getPublicHazards(user).subscribe((hazards) => {
      this.hazards = hazards
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

  doRefresh(event) {
    this.reportSvc.getPublicHazards(this.user).subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
      event.target.complete()
    })
  }

}
