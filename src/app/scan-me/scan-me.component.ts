import { Component, OnInit, OnDestroy } from '@angular/core';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';
import { ContactInfo } from '../models/contact-info';
import { ContactService } from '../services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scan-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scan-me.component.html',
  styleUrls: ['./scan-me.component.css'],
})
export class ScanMeComponent implements OnInit, OnDestroy {
  userInfo: ContactInfo[] = [];
  qrCodeDataUrl = '';
  private subscription: Subscription;

  constructor(private contactService: ContactService) {
    this.subscription = this.contactService.contacts$.subscribe((contacts) => {
      this.userInfo = contacts;
      if (this.userInfo && this.userInfo.length > 0) {
        this.generateQRCode();
      } else {
        this.qrCodeDataUrl = '';
      }
    });
  }

  ngOnInit() {
    // Initial QR code generation if contacts exist
    if (this.userInfo && this.userInfo.length > 0) {
      this.generateQRCode();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        case 'linkedin':
          vCard += `X-SOCIALPROFILE;TYPE=linkedin:${contact.value}\n`;
          break;
        case 'github':
          vCard += `X-SOCIALPROFILE;TYPE=github:${contact.value}\n`;
          break;
        case 'twitter':
          vCard += `X-SOCIALPROFILE;TYPE=twitter:${contact.value}\n`;
          break;
        case 'instagram':
          vCard += `X-SOCIALPROFILE;TYPE=instagram:${contact.value}\n`;
          break;
        default:
          if (contact.type === 'Custom' && contact.customType) {
            vCard += `NOTE:${contact.customType}: ${contact.value}\n`;
          } else {
            vCard += `NOTE:${contact.type}: ${contact.value}\n`;
          }
          break;
      }
    });

    vCard += 'END:VCARD';
    return vCard;
  }

  async generateQRCode() {
    if (this.userInfo && this.userInfo.length > 0) {
      try {
        const vCardData = this.createVCardData(this.userInfo);
        this.qrCodeDataUrl = await QRCode.toDataURL(vCardData, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 400,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        this.qrCodeDataUrl = '';
      }
    } else {
      this.qrCodeDataUrl = '';
    }
  }

  downloadQRCode() {
    if (this.qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'contact-qr-code.png';
      link.href = this.qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
