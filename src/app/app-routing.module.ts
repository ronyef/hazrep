import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './member/tabs/tabs.module#TabsPageModule' },
  // { path: 'public-hazards', loadChildren: './member/public-hazards/public-hazards.module#PublicHazardsPageModule' },
  // { path: 'private-hazards', loadChildren: './member/private-hazards/private-hazards.module#PrivateHazardsPageModule' },
  // { path: 'settings', loadChildren: './member/settings/settings.module#SettingsPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
