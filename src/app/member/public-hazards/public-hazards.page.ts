import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-hazards',
  templateUrl: './public-hazards.page.html',
  styleUrls: ['./public-hazards.page.scss'],
})
export class PublicHazardsPage implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login'])
    })
  }

}
