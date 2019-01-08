import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicHazardsPage } from './public-hazards.page';

const routes: Routes = [
  {
    path: '',
    component: PublicHazardsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PublicHazardsPage]
})
export class PublicHazardsPageModule {}
