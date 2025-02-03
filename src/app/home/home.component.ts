import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  userInfo: any[] = [];
  showScanMe = false;
  qrCodeDataUrl = '';

  constructor(private router: Router) {}

  onUserInfoSubmitted(userInfo: any[]) {
    this.userInfo = userInfo;
    this.showScanMe = true;
  }

  onQrCodeGenerated(qrCodeDataUrl: string) {
    this.qrCodeDataUrl = qrCodeDataUrl;
  }

  async shareQRCode() {}

  goBack() {
    this.router.navigate(['/set-user-info']);
  }

  onLoginSignOutClick() {
    console.log('Login or Signout clicked');
  }
}
