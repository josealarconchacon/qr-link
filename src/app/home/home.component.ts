import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  userInfo: any[] = [];
  showScanMe = false;
  qrCodeDataUrl = '';

  onUserInfoSubmitted(userInfo: any[]) {
    this.userInfo = userInfo;
    this.showScanMe = true;
  }

  onQrCodeGenerated(qrCodeDataUrl: string) {
    this.qrCodeDataUrl = qrCodeDataUrl;
  }

  // async shareQRCode() {}
  async shareQRCode() {
    if (this.isIos()) {
      // For iOS, create an Apple Wallet pass (the link should point to a downloadable .pkpass file)
      window.location.href = `https://example.com/path/to/your/pass.pkpass`;
    } else if (this.isAndroid()) {
      // For Android, you can direct users to Google Pay (pass data should ideally be in the Google Pay format)
      window.location.href = `https://pay.google.com/gp/v/save/{YOUR_PASS_DATA}`;
    } else {
      alert('This functionality is supported only on iOS or Android devices');
    }
  }

  // Check if the device is iOS
  private isIos(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Check if the device is Android
  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }
}
