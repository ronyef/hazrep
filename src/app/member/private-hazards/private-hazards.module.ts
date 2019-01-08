import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrivateHazardsPage } from './private-hazards.page';

const routes: Routes = [
  {
    path: '',
    component: PrivateHazardsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrivateHazardsPage]
})
export class PrivateHazardsPageModule {}
