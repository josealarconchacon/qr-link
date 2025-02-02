import { Component } from '@angular/core';
// import { Share } from '@capacitor/share';

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

  async shareQRCode() {
    //   try {
    //     await Share.share({
    //       title: 'My Contact Card',
    //       text: 'Scan this QR code to save my contact information',
    //       url: this.qrCodeDataUrl,
    //     });
    //   } catch (error) {
    //     console.error('Error sharing QR code:', error);
    //   }
  }
}
