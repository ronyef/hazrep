import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HazardComponent } from './hazard/hazard.component';
import { IonicModule } from '@ionic/angular';
import { HazardModalComponent } from './hazard-modal/hazard-modal.component'
import { AgmCoreModule } from '@agm/core';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [HazardComponent, HazardModalComponent],
  entryComponents: [HazardModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    AgmCoreModule
  ],
  exports: [HazardComponent, HazardModalComponent]
})
export class ComponentsModule { }
