import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';

import { ContactInfo } from '../models/contact-info';

@Component({
  selector: 'app-scan-me',
  templateUrl: './scan-me.component.html',
  styleUrls: ['./scan-me.component.css'],
})
export class ScanMeComponent implements OnInit {
  @Input() userInfo: ContactInfo[] = [];
  @Output() qrCodeGenerated = new EventEmitter<string>();
  qrCodeDataUrl = '';

  ngOnInit() {
    this.generateQRCode();
  }

  private createVCardData(contacts: ContactInfo[]): string {
    let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';

    contacts.forEach((contact) => {
      switch (contact.type.toLowerCase()) {
        case 'phone':
          vCard += `TEL:${contact.value}\n`;
          break;
        case 'email':
          vCard += `EMAIL:${contact.value}\n`;
          break;
        case 'website':
          vCard += `URL:${contact.value}\n`;
          break;
        case 'facebook':
          vCard += `X-SOCIALPROFILE;TYPE=facebook:${contact.value}\n`;
          break;
        case 'twitter':
          vCard += `X-SOCIALPROFILE;TYPE=twitter:${contact.value}\n`;
          break;
        case 'instagram':
          vCard += `X-SOCIALPROFILE;TYPE=instagram:${contact.value}\n`;
          break;
        case 'linkedin':
          vCard += `X-SOCIALPROFILE;TYPE=linkedin:${contact.value}\n`;
          break;
        case 'github':
          vCard += `X-SOCIALPROFILE;TYPE=github:${contact.value}\n`;
          break;
        default:
          vCard += `NOTE:${contact.type}: ${contact.value}\n`;
          break;
      }
    });

    vCard += 'END:VCARD';
    return vCard;
  }

  async generateQRCode() {
    if (this.userInfo.length > 0) {
      try {
        const vCardData = this.createVCardData(this.userInfo);
        this.qrCodeDataUrl = await QRCode.toDataURL(vCardData, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 300,
        });
        this.qrCodeGenerated.emit(this.qrCodeDataUrl);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }
  }
}
