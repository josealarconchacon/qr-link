import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

interface Contact {
  type: string;
  value: string;
}

@Component({
  selector: 'app-set-user-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './set-user-info.component.html',
  styleUrls: ['./set-user-info.component.css'],
})
export class SetUserInfoComponent {
  userInfo: Contact[] = []; // Specify the type of the array here
  newContactType = '';
  newContactValue = '';
  contactTypes = [
    'Phone',
    'Email',
    'Website',
    'Facebook',
    'Twitter',
    'Instagram',
    'LinkedIn',
    'GitHub',
  ];

  @Output() userInfoSubmitted = new EventEmitter<Contact[]>();

  addContact() {
    if (this.newContactType && this.newContactValue) {
      this.userInfo.push({
        type: this.newContactType,
        value: this.newContactValue,
      });
      this.newContactType = '';
      this.newContactValue = '';
    }
  }
  getContactIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Email: 'email',
      Phone: 'phone',
      Website: 'language',
      LinkedIn: 'work',
      Twitter: 'alternate_email',
      // Add more mappings as needed
    };
    return icons[type] || 'contact_page';
  }

  removeContact(index: number) {
    this.userInfo.splice(index, 1);
  }

  submitUserInfo() {
    this.userInfoSubmitted.emit(this.userInfo);
  }
}
