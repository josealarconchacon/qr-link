import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactInfo } from '../models/contact-info';
import { ContactService } from '../services/contact.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './set-user-info.component.html',
  styleUrls: ['./set-user-info.component.css'],
})
export class SetUserInfoComponent implements OnInit {
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
  userInfo: ContactInfo[] = [];
  newContactType = '';
  newContactValue = '';
  customContactType = '';
  customContactIcon = 'bi-bookmark-star';
  customContactColor = 'primary';
  showAllTypes = false;
  isAddingCustom = false;

  newCustomContact = {
    type: '',
    value: '',
    icon: 'bi-bookmark-star',
    color: 'primary',
  };

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit() {
    // Load existing contacts
    this.contactService.contacts$.subscribe((contacts) => {
      this.userInfo = contacts;
    });
  }

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

  getContactIcon(type: string | ContactInfo, customType?: string): string {
    if (typeof type === 'object') {
      if (type.type === 'Custom' && type.customType) {
        const customTypeConfig = this.customContactTypes.find(
          (t) => t.label === type.customType
        );
        return customTypeConfig?.icon || 'bi bi-bookmark-star';
      }
      return this.getContactIcon(type.type, type.customType);
    }

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

  getDisplayType(contact: ContactInfo): string {
    return (
      contact.customType ||
      contact.type.charAt(0).toUpperCase() + contact.type.slice(1)
    );
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

    this.newCustomContact = {
      type: this.customContactType.trim(),
      value: '',
      icon: this.customContactIcon,
      color: this.customContactColor,
    };

    this.newContactType = 'Custom';
    this.isAddingCustom = false;

    setTimeout(() => {
      const input = document.getElementById('contactValue') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  addContact() {
    if (this.newContactType && this.newContactValue) {
      let newContact: ContactInfo;

      if (this.newContactType === 'Custom') {
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

        newContact = {
          type: 'Custom',
          value: this.newContactValue.trim(),
          customType: this.newCustomContact.type,
          customIcon: this.newCustomContact.icon,
          customColor: this.newCustomContact.color,
        };
      } else {
        newContact = {
          type: this.newContactType,
          value: this.newContactValue.trim(),
        };
      }

      this.userInfo.push(newContact);
      this.contactService.updateContacts(this.userInfo);
      this.newContactValue = '';
      this.newContactType = '';
    }
  }

  removeContact(index: number) {
    this.userInfo.splice(index, 1);
    this.contactService.updateContacts(this.userInfo);
  }

  private updateAllContactTypes() {
    this.allContactTypes = [
      ...this.defaultContactTypes,
      ...this.customContactTypes,
    ];
  }

  submitUserInfo() {
    if (this.userInfo.length > 0) {
      this.contactService.updateContacts(this.userInfo);
      this.router.navigate(['/scan-me']);
    }
  }

  toggleShowAllTypes() {
    this.showAllTypes = !this.showAllTypes;
  }

  cancelCustomType() {
    this.isAddingCustom = false;
    this.customContactType = '';
    this.newContactType = '';
    this.newContactValue = '';
  }

  isNewContact(index: number): boolean {
    return index === this.userInfo.length - 1;
  }

  onSubmit() {
    this.submitUserInfo();
  }
}
