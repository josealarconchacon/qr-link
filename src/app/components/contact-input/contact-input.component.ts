import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactType } from 'src/app/models/contact-info';

@Component({
  selector: 'app-contact-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-input">
      <div class="form-floating">
        <input
          type="text"
          class="form-control form-control-lg"
          [(ngModel)]="contactValue"
          id="contactValue"
          [placeholder]="getPlaceholder()"
          [type]="getInputType()"
          (keyup.enter)="onAdd()"
          [attr.aria-label]="getPlaceholder()"
          autocomplete="off"
        />
        <label for="contactValue" class="d-flex align-items-center">
          <i
            [class]="getContactIcon() + ' me-2'"
            [style.color]="getIconColor()"
            aria-hidden="true"
          ></i>
          <span>{{ getPlaceholder() }}</span>
        </label>
      </div>
      <div class="text-muted small mt-2" *ngIf="isCustomType">
        <i class="bi bi-info-circle me-1"></i>
        Add contact information for your new custom type "{{ customType }}"
      </div>
    </div>

    <div class="d-grid">
      <button
        class="btn btn-primary btn-lg"
        (click)="onAdd()"
        [disabled]="!contactValue"
        aria-label="Add contact information"
      >
        <i class="bi bi-plus-circle me-2" aria-hidden="true"></i>
        {{ isCustomType ? 'Add ' + customType + ' Contact' : 'Add Contact' }}
      </button>
    </div>
  `,
  styles: [],
})
export class ContactInputComponent {
  @Input() selectedType: string = '';
  @Input() customType: string = '';
  @Input() customIcon: string = '';
  @Input() customColor: string = '';
  @Output() add = new EventEmitter<string>();

  contactValue = '';

  get isCustomType(): boolean {
    return this.selectedType === 'Custom';
  }

  getPlaceholder(): string {
    const placeholders: { [key: string]: string } = {
      Phone: 'Enter phone number',
      Email: 'Enter email address',
      LinkedIn: 'Enter LinkedIn profile URL',
      GitHub: 'Enter GitHub username or URL',
      Website: 'Enter website URL',
      Twitter: 'Enter Twitter handle',
      Instagram: 'Enter Instagram handle',
    };
    return this.isCustomType
      ? `Enter ${this.customType} value`
      : placeholders[this.selectedType] || 'Enter value';
  }

  getInputType(): string {
    const inputTypes: { [key: string]: string } = {
      Phone: 'tel',
      Email: 'email',
      Website: 'url',
      LinkedIn: 'url',
    };
    return inputTypes[this.selectedType] || 'text';
  }

  getContactIcon(): string {
    return this.isCustomType ? `bi ${this.customIcon}` : this.getDefaultIcon();
  }

  getIconColor(): string {
    return this.isCustomType ? `var(--bs-${this.customColor})` : '';
  }

  private getDefaultIcon(): string {
    const icons: { [key: string]: string } = {
      Phone: 'bi bi-phone',
      Email: 'bi bi-envelope',
      LinkedIn: 'bi bi-linkedin',
      GitHub: 'bi bi-github',
      Website: 'bi bi-globe',
      Twitter: 'bi bi-twitter',
      Instagram: 'bi bi-instagram',
    };
    return icons[this.selectedType] || 'bi bi-person';
  }

  onAdd() {
    if (this.contactValue.trim()) {
      this.add.emit(this.contactValue.trim());
      this.contactValue = '';
    }
  }
}
