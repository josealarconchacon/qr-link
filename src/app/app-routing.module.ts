import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetUserInfoComponent } from './set-user-info/set-user-info.component';

const routes: Routes = [
  {
    path: 'set-user-info',
    component: SetUserInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
