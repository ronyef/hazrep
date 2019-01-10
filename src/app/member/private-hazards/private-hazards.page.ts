import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'

@Component({
  selector: 'app-private-hazards',
  templateUrl: './private-hazards.page.html',
  styleUrls: ['./private-hazards.page.scss'],
})
export class PrivateHazardsPage implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.afAuth.auth.signOut()
  }

  goReport() {
    this.router.navigate(['/member/report'])
  }

}
