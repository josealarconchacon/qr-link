import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScanMeComponent } from '../scan-me/scan-me.component';
import { SetUserInfoComponent } from '../set-user-info/set-user-info.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactInfo } from '../models/contact-info';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ScanMeComponent,
    SetUserInfoComponent,
    ContactListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userInfo: ContactInfo[] = [];
  showScanMe = false;
  qrCodeDataUrl = '';

  constructor(private router: Router) {}

  onUserInfoSubmitted(userInfo: ContactInfo[]) {
    console.log('User info submitted:', userInfo);
    // Update userInfo immediately
    this.userInfo = [...userInfo];
    // Store the contacts in localStorage for persistence
    localStorage.setItem('userContacts', JSON.stringify(userInfo));
    // Show QR code after a short delay to ensure proper change detection
    setTimeout(() => {
      this.showScanMe = true;
      console.log('Updated userInfo:', this.userInfo);
      console.log('showScanMe:', this.showScanMe);
    });
  }

  onQrCodeGenerated(qrCodeDataUrl: string) {
    console.log('QR code generated:', qrCodeDataUrl);
    this.qrCodeDataUrl = qrCodeDataUrl;
  }

  async shareQRCode() {
    // Implement share functionality
    console.log('Sharing QR code');
  }

  goBack() {
    this.showScanMe = false;
    this.qrCodeDataUrl = '';
    this.userInfo = [];
    localStorage.removeItem('userContacts');
  }

  onLoginSignOutClick() {
    console.log('Login or Signout clicked');
  }

  getContactIcon(contact: ContactInfo): string {
    const iconMap: { [key: string]: string } = {
      Phone: 'bi-telephone',
      Email: 'bi-envelope',
      LinkedIn: 'bi-linkedin',
      GitHub: 'bi-github',
      Website: 'bi-globe',
      Twitter: 'bi-twitter',
      Instagram: 'bi-instagram',
    };

    if (contact.type === 'Custom' && contact.customIcon) {
      return contact.customIcon;
    }

    return iconMap[contact.type] || 'bi-person';
  }

  getDisplayType(contact: ContactInfo): string {
    return (
      contact.customType ||
      contact.type.charAt(0).toUpperCase() + contact.type.slice(1)
    );
  }

  ngOnInit() {
    console.log('HomeComponent initialized');
    // Load contacts from localStorage on component initialization
    const savedContacts = localStorage.getItem('userContacts');
    if (savedContacts) {
      this.userInfo = JSON.parse(savedContacts);
      this.showScanMe = true; // Show QR code if we have saved contacts
      console.log('Loaded saved contacts:', this.userInfo);
    }
  }
}
