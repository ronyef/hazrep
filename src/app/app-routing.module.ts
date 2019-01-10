import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'member', loadChildren: './member/member.module#MemberModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './public/signup/signup.module#SignupPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
