import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetUserInfoComponent } from './set-user-info/set-user-info.component';
import { ScanMeComponent } from './scan-me/scan-me.component';
import { ContactListComponent } from './contact-list/contact-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/scan-me', pathMatch: 'full' },
  { path: 'set-user-info', component: SetUserInfoComponent },
  { path: 'scan-me', component: ScanMeComponent },
  { path: 'contact-list', component: ContactListComponent },
  { path: '**', redirectTo: '/scan-me' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
