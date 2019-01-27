import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Hazard } from 'src/app/core/hazard';
import { ReportService } from 'src/app/core/report.service';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/core/user';
import { GeoService } from 'src/app/core/geo.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-public-hazards',
  templateUrl: './public-hazards.page.html',
  styleUrls: ['./public-hazards.page.scss'],
})
export class PublicHazardsPage implements OnInit {

  hazards: Hazard[]
  user: any
  radius: number = 30
  obserVableHazards: Observable<Hazard[]>

  hazardsObservable: Observable<any[]>

  subscription: Subscription

  constructor(
    private authService: AuthService, 
    private router: Router,
    private reportSvc: ReportService,
    private geoService: GeoService,
    private zone: NgZone
  ) { }

  ngOnInit() {

    this.authService.getUser().then((user) => {
      this.user = user
      // this.getPublicHazards(this.user)
      this.getPublicHazardsByRadius(30)
    })
    
  }

  getPublicHazards(user: any) {

    this.reportSvc.getPublicHazards(user).subscribe((hazards) => {
      this.hazards = hazards
    })
    
  }

  getPublicHazardsByRadius(radius: number){

    this.geoService.getPublicHazards(this.user, radius).then((resp) => {
      this.geoService.nearbyHazards.subscribe((hazards) => {
        this.hazards = hazards
        this.radius = radius

        this.zone.run(async () => {
          this.router.navigate(['member','tabs','public'])
        })

      })
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
    this.geoService.getPublicHazards(this.user, this.radius).subscribe((hazards) => {
      console.log(hazards)
      this.hazards = hazards
      event.target.complete()
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
