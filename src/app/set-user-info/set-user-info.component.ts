import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContactInfo } from '../models/contact-info';
import { ContactType, ContactColor } from '../models/contact-type.interface';
import { ContactService } from '../services/contact.service';
import { ContactTypeSelectorComponent } from '../components/contact-type-selector/contact-type-selector.component';
import { CustomTypeCreatorComponent } from '../components/custom-type-creator/custom-type-creator.component';
import { ContactInputComponent } from '../components/contact-input/contact-input.component';
import { ContactListComponent } from '../components/contact-list/contact-list.component';

@Component({
  selector: 'app-set-user-info',
  standalone: true,
  imports: [
    CommonModule,
    ContactTypeSelectorComponent,
    CustomTypeCreatorComponent,
    ContactInputComponent,
    ContactListComponent,
  ],
  template: `
    <div class="contact-container">
      <div class="card glass-card">
        <div class="card-header bg-transparent text-center">
          <h1 class="card-title">Let's create your digital business card</h1>
          <p class="card-subtitle">Choose how people can reach you</p>
        </div>

        <div class="card-body p-4">
          <app-contact-type-selector
            [contactTypes]="allContactTypes"
            [selectedType]="newContactType"
            [isAddingCustom]="isAddingCustom"
            (typeSelect)="onTypeSelect($event)"
          >
            <app-custom-type-creator
              *ngIf="isAddingCustom"
              [availableIcons]="availableIcons"
              [availableColors]="availableColors"
              (add)="onCustomTypeAdd($event)"
              (cancel)="onCustomTypeCancel()"
            ></app-custom-type-creator>
          </app-contact-type-selector>

          <app-contact-input
            *ngIf="newContactType"
            [selectedType]="newContactType"
            [customType]="newCustomContact.type"
            [customIcon]="newCustomContact.icon"
            [customColor]="newCustomContact.color"
            (add)="onContactAdd($event)"
          ></app-contact-input>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :root {
        --spacing-xs: 0.25rem;
        --spacing-sm: 0.5rem;
        --spacing-md: 1rem;
        --spacing-lg: 1.5rem;
        --spacing-xl: 2rem;
        --spacing-xxl: 2.5rem;

        --border-radius-sm: 12px;
        --border-radius-md: 16px;
        --border-radius-lg: 24px;
        --border-radius-xl: 28px;

        --transition-speed: 0.3s;
        --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
      }

      :host {
        display: block;
        width: 100%;
        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
        padding: var(--spacing-md);
      }

      .contact-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .glass-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-xl);
      }

      .card-title {
        font-size: clamp(1.5rem, 4vw, 2.25rem);
        font-weight: 700;
        color: #1a1f36;
        margin-bottom: var(--spacing-md);
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      .card-subtitle {
        font-size: clamp(0.875rem, 2vw, 1.125rem);
        color: #4f566b;
        font-weight: 400;
        line-height: 1.5;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          background: linear-gradient(135deg, #1a1f36 0%, #2d3748 100%);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
        }

        .card-title {
          color: #f8fafc;
        }

        .card-subtitle {
          color: #94a3b8;
        }
      }
    `,
  ],
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

  availableColors: ContactColor[] = [
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
  isAddingCustom = false;

  newCustomContact = {
    type: '',
    value: '',
    icon: 'bi-bookmark-star',
    color: 'primary',
  };

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit() {
    this.contactService.contacts$.subscribe((contacts) => {
      console.log('Contacts updated in set-user-info:', contacts);
      this.userInfo = contacts;
    });
  }

  onTypeSelect(type: string) {
    if (type === 'Custom') {
      this.isAddingCustom = true;
      this.newCustomContact = {
        type: '',
        value: '',
        icon: 'bi-bookmark-star',
        color: 'primary',
      };
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

  onCustomTypeAdd(data: { type: string; icon: string; color: string }) {
    const { type, icon, color } = data;
    if (!this.customContactTypes.some((t) => t.label === type)) {
      const newCustomType: ContactType = {
        id: `custom-${type}`,
        label: type,
        icon: `bi ${icon}`,
        color: color,
        isCustom: true,
      };
      this.customContactTypes.push(newCustomType);
      this.updateAllContactTypes();
    }

    this.newCustomContact = {
      type: type,
      value: '',
      icon: icon,
      color: color,
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

  onCustomTypeCancel() {
    this.isAddingCustom = false;
    this.newContactType = '';
  }

  onContactAdd(value: string) {
    let newContact: ContactInfo;

    if (this.newContactType === 'Custom') {
      newContact = {
        type: 'Custom',
        value: value,
        customType: this.newCustomContact.type,
        customIcon: `bi ${this.newCustomContact.icon}`,
        customColor: this.newCustomContact.color,
      };
    } else {
      newContact = {
        type: this.newContactType,
        value: value,
      };
    }

    console.log('Adding new contact:', newContact);
    const updatedContacts = [...this.userInfo, newContact];
    console.log('Updated contacts array:', updatedContacts);
    this.contactService.updateContacts(updatedContacts);
    this.newContactType = '';
    this.newCustomContact = {
      type: '',
      value: '',
      icon: 'bi-bookmark-star',
      color: 'primary',
    };
  }

  private updateAllContactTypes() {
    this.allContactTypes = [
      ...this.defaultContactTypes,
      ...this.customContactTypes,
    ];
  }

  onSubmit() {
    if (this.userInfo.length > 0) {
      this.contactService.updateContacts(this.userInfo);
      this.router.navigate(['/scan-me']);
    }
  }

  getSelectedTypeColor(): string {
    if (this.newContactType === 'Custom' && this.newCustomContact.color) {
      return `var(--bs-${this.newCustomContact.color})`;
    }
    const type = this.allContactTypes.find((t) => t.id === this.newContactType);
    return type ? `var(--bs-${type.color})` : '#3B82F6';
  }

  getSelectedTypeIcon(): string {
    if (this.newContactType === 'Custom' && this.newCustomContact.icon) {
      return `bi ${this.newCustomContact.icon}`;
    }
    const type = this.allContactTypes.find((t) => t.id === this.newContactType);
    return type ? type.icon : 'bi-person';
  }

  getSelectedTypeLabel(): string {
    if (this.newContactType === 'Custom') {
      return this.newCustomContact.type || 'Custom Contact';
    }
    const type = this.allContactTypes.find((t) => t.id === this.newContactType);
    return type ? type.label : 'Contact';
  }

  getSelectedTypeDescription(): string {
    const descriptions: { [key: string]: string } = {
      Phone: 'Add your phone number',
      Email: 'Add your email address',
      LinkedIn: 'Add your LinkedIn profile URL',
      GitHub: 'Add your GitHub username or URL',
      Website: 'Add your website URL',
      Twitter: 'Add your Twitter handle',
      Instagram: 'Add your Instagram handle',
    };
    return this.newContactType === 'Custom'
      ? 'Add your custom contact information'
      : descriptions[this.newContactType] || 'Add your contact information';
  }

  clearAllContacts() {
    this.userInfo = [];
    this.contactService.updateContacts(this.userInfo);
  }
}
