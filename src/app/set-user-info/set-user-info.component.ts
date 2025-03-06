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
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

interface Contact {
  type: string;
  value: string;
  timestamp?: number;
  customType?: string;
  customIcon?: string;
  customColor?: string;
  order?: number;
}

interface ContactType {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom?: boolean;
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
    DragDropModule,
  ],
  templateUrl: './set-user-info.component.html',
  styleUrls: ['./set-user-info.component.css'],
})
export class SetUserInfoComponent {
  @Output() userInfoSubmitted = new EventEmitter<Contact[]>();

  defaultContactTypes: ContactType[] = [
    { id: 'Phone', label: 'Phone', icon: 'bi bi-phone', color: 'success' },
    { id: 'Email', label: 'Email', icon: 'bi bi-envelope', color: 'primary' },
    {
      id: 'LinkedIn',
      label: 'LinkedIn',
      icon: 'bi bi-linkedin',
      color: 'info',
    },
    { id: 'GitHub', label: 'GitHub', icon: 'bi bi-github', color: 'dark' },
    { id: 'Website', label: 'Website', icon: 'bi bi-globe', color: 'purple' },
    { id: 'Twitter', label: 'Twitter', icon: 'bi bi-twitter', color: 'info' },
    {
      id: 'Instagram',
      label: 'Instagram',
      icon: 'bi bi-instagram',
      color: 'danger',
    },
  ];

  availableIcons: string[] = [
    'bi-phone',
    'bi-envelope',
    'bi-linkedin',
    'bi-github',
    'bi-globe',
    'bi-twitter',
    'bi-instagram',
    'bi-facebook',
    'bi-youtube',
    'bi-whatsapp',
    'bi-telegram',
    'bi-discord',
    'bi-slack',
    'bi-skype',
    'bi-pinterest',
    'bi-snapchat',
    'bi-tiktok',
    'bi-medium',
    'bi-reddit',
    'bi-twitch',
    'bi-spotify',
    'bi-apple',
    'bi-android',
    'bi-windows',
    'bi-link-45deg',
    'bi-chat',
    'bi-bookmark-star',
  ];

  availableColors: { label: string; value: string }[] = [
    { label: 'Blue', value: 'primary' },
    { label: 'Green', value: 'success' },
    { label: 'Red', value: 'danger' },
    { label: 'Yellow', value: 'warning' },
    { label: 'Purple', value: 'purple' },
    { label: 'Cyan', value: 'info' },
    { label: 'Dark', value: 'dark' },
  ];

  customContactTypes: ContactType[] = [];
  allContactTypes: ContactType[] = [...this.defaultContactTypes];

  newContactType = '';
  newContactValue = '';
  customContactType = '';
  customContactIcon = 'bi-bookmark-star';
  customContactColor = 'primary';
  userInfo: Contact[] = [];
  private readonly ANIMATION_DURATION = 2000; // 2 seconds
  showAllTypes = false;
  isAddingCustom = false;

  newCustomContact = {
    type: '',
    value: '',
    icon: 'bi-bookmark-star',
    color: 'primary',
  };

  selectContactType(type: string) {
    if (type === 'Custom') {
      this.isAddingCustom = true;
      this.customContactType = '';
      this.customContactIcon = 'bi-bookmark-star';
      this.customContactColor = 'primary';
      return;
    }

    this.newContactType = type;
    setTimeout(() => {
      const input = document.getElementById('contactValue') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  getContactIcon(type: string, customType?: string): string {
    if (type === 'Custom' && customType) {
      const customTypeConfig = this.customContactTypes.find(
        (t) => t.label === customType
      );
      return customTypeConfig?.icon || 'bi bi-bookmark-star';
    }

    const typeConfig = this.allContactTypes.find((t) => t.id === type);
    return typeConfig?.icon || 'bi bi-person';
  }

  getIconColorClass(type: string, customColor?: string): string {
    if (customColor) {
      return customColor;
    }
    const typeConfig = this.allContactTypes.find((t) => t.id === type);
    return typeConfig?.color || 'secondary';
  }

  getPlaceholder(type: string): string {
    const placeholders: { [key: string]: string } = {
      Phone: 'Enter phone number',
      Email: 'Enter email address',
      LinkedIn: 'Enter LinkedIn profile URL',
      GitHub: 'Enter GitHub username or URL',
      Website: 'Enter website URL',
      Twitter: 'Enter Twitter handle',
      Instagram: 'Enter Instagram handle',
    };
    return placeholders[type] || 'Enter value';
  }

  getInputType(type: string): string {
    const inputTypes: { [key: string]: string } = {
      Phone: 'tel',
      Email: 'email',
      Website: 'url',
      LinkedIn: 'url',
    };
    return inputTypes[type] || 'text';
  }

  addCustomType() {
    if (!this.customContactType.trim()) return;

    // Store the custom type details temporarily
    this.newCustomContact = {
      type: this.customContactType.trim(),
      value: '',
      icon: this.customContactIcon,
      color: this.customContactColor,
    };

    // Switch to contact value input mode
    this.newContactType = 'Custom';
    this.isAddingCustom = false;

    // Focus the contact value input
    setTimeout(() => {
      const input = document.getElementById('contactValue') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  addContact() {
    if (this.newContactType && this.newContactValue) {
      if (this.newContactType === 'Custom') {
        // For custom types, first add the type to the list
        const customType = this.newCustomContact.type;
        if (!this.customContactTypes.some((t) => t.label === customType)) {
          const newCustomType: ContactType = {
            id: `custom-${customType}`,
            label: customType,
            icon: `bi ${this.newCustomContact.icon}`,
            color: this.newCustomContact.color,
            isCustom: true,
          };
          this.customContactTypes.push(newCustomType);
          this.updateAllContactTypes();
        }

        // Then create the contact
        const newContact: Contact = {
          type: 'Custom',
          value: this.newContactValue.trim(),
          timestamp: Date.now(),
          customType: this.newCustomContact.type,
          customIcon: this.newCustomContact.icon,
          customColor: this.newCustomContact.color,
          order: this.userInfo.length,
        };

        this.userInfo.push(newContact);
        this.newContactValue = '';
        this.newCustomContact = {
          type: '',
          value: '',
          icon: 'bi-bookmark-star',
          color: 'primary',
        };
      } else {
        // Handle regular contact types as before
        const newContact: Contact = {
          type: this.newContactType,
          value: this.newContactValue.trim(),
          timestamp: Date.now(),
          order: this.userInfo.length,
        };

        this.userInfo.push(newContact);
        this.newContactValue = '';
      }
    }
  }

  removeContact(index: number) {
    const removedContact = this.userInfo[index];
    this.userInfo.splice(index, 1);

    // If it was a custom type and no other contacts use it, remove from custom types
    if (removedContact.customType) {
      const isTypeStillInUse = this.userInfo.some(
        (contact) => contact.customType === removedContact.customType
      );
      if (!isTypeStillInUse) {
        this.customContactTypes = this.customContactTypes.filter(
          (t) => t.label !== removedContact.customType
        );
        this.updateAllContactTypes();
      }
    }
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    moveItemInArray(this.userInfo, event.previousIndex, event.currentIndex);
    // Update order property
    this.userInfo.forEach((contact, index) => {
      contact.order = index;
    });
  }

  submitUserInfo() {
    if (this.userInfo.length > 0) {
      this.userInfoSubmitted.emit(this.userInfo);
    }
  }

  isNewContact(index: number): boolean {
    const contact = this.userInfo[index];
    if (!contact?.timestamp) return false;
    return Date.now() - contact.timestamp < this.ANIMATION_DURATION;
  }

  getDisplayType(contact: Contact): string {
    return contact.customType || contact.type;
  }

  private updateAllContactTypes() {
    this.allContactTypes = [
      ...this.defaultContactTypes,
      ...this.customContactTypes,
    ];
  }

  toggleShowAllTypes() {
    this.showAllTypes = !this.showAllTypes;
  }

  cancelCustomType() {
    this.isAddingCustom = false;
    this.customContactType = '';
    this.customContactIcon = 'bi-bookmark-star';
    this.customContactColor = 'primary';
    this.newCustomContact = {
      type: '',
      value: '',
      icon: 'bi-bookmark-star',
      color: 'primary',
    };
  }
}
