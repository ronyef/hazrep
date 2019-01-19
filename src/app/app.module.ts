import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { CoreModule } from './core/core.module';
import { ComponentsModule } from './components/components.module'

import { Camera } from '@ionic-native/camera/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AgmCoreModule } from '@agm/core'

import { environment } from '../environments/environment'


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbMejVUUM7xt2a6V7vVRykRyzu3JDVyD4'
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
