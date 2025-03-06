import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SetUserInfoComponent } from './set-user-info/set-user-info.component';
import { ScanMeComponent } from './scan-me/scan-me.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ScanMeComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, SetUserInfoComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
