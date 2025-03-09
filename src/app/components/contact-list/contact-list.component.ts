import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfo } from '../../models/contact-info';
import { ContactType } from '../../models/contact-type.interface';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-list">
      <div class="container mt-3 mt-md-4 px-2 px-sm-3 px-lg-4">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div
            class="card-header bg-white py-2 py-md-3 px-3 px-md-4 border-bottom"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1 fw-bold text-dark">Contacts</h5>
                <small class="text-muted d-block fw-medium">
                  {{ contacts.length }} contact{{
                    contacts.length !== 1 ? 's' : ''
                  }}
                </small>
              </div>
              <span
                class="badge bg-primary-subtle text-primary fw-semibold px-2 py-1"
              >
                {{ contacts.length }}
              </span>
            </div>
          </div>

          <ul class="list-group list-group-flush">
            <li
              *ngFor="let contact of contacts; let i = index"
              class="list-group-item px-3 px-md-4 py-2 py-md-3"
              [class.bg-light]="hoveredIndex === i"
              [class.border-primary-subtle]="selectedIndex === i"
              [class.border-start]="selectedIndex === i"
              (mouseenter)="hoveredIndex = i"
              (mouseleave)="hoveredIndex = null"
              (click)="selectContact(i)"
              role="button"
              tabindex="0"
              [attr.aria-label]="
                getContactLabel(contact) + ': ' + contact.value
              "
            >
              <div class="d-flex align-items-center gap-2 gap-md-3">
                <div
                  class="contact-icon flex-shrink-0 position-relative shadow-sm"
                  [style.background-color]="getIconBackground(contact)"
                >
                  <i
                    [class]="getIconClass(contact)"
                    class="text-white position-absolute top-50 start-50 translate-middle"
                    aria-hidden="true"
                  ></i>
                </div>

                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex align-items-center gap-1 gap-md-2">
                    <div class="text-truncate fw-semibold text-dark">
                      {{ contact.value }}
                    </div>
                    <span
                      class="copied-text badge bg-success-subtle text-success fw-medium ms-auto me-2 me-md-3"
                      [class.d-none]="!copiedIndex || copiedIndex !== i"
                    >
                      Copied!
                    </span>
                  </div>
                  <small class="text-muted d-block text-truncate fw-medium">
                    {{ getContactLabel(contact) }}
                  </small>
                </div>

                <div
                  class="action-buttons ms-1 ms-md-2 d-flex align-items-center gap-1 gap-md-2 flex-shrink-0 flex-nowrap"
                >
                  <button
                    class="btn btn-sm btn-outline-primary rounded-circle p-0 shadow-sm"
                    (click)="
                      copyToClipboard(contact.value, i);
                      $event.stopPropagation()
                    "
                    [attr.aria-label]="'Copy ' + contact.value"
                  >
                    <i class="bi bi-clipboard"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger rounded-circle p-0 shadow-sm"
                    (click)="onRemove(i, $event)"
                    [attr.aria-label]="'Remove ' + getContactLabel(contact)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>

          <div
            *ngIf="contacts.length === 0"
            class="text-center py-4 py-md-5 bg-light"
          >
            <i
              class="bi bi-person-lines-fill text-muted opacity-75"
              style="font-size: clamp(1.5rem, 4vw, 2.5rem);"
            ></i>
            <p class="text-muted mt-2 mt-md-3 fw-medium">No contacts yet</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ContactListComponent implements OnChanges {
  @Input() contacts: ContactInfo[] = [];
  @Input() contactTypes: ContactType[] = [];
  @Output() remove = new EventEmitter<number>();

  hoveredIndex: number | null = null;
  selectedIndex: number | null = null;
  copiedIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contacts']) {
      console.log('Contacts changed in contact-list:', this.contacts);
    }
  }

  getIconClass(contact: ContactInfo): string {
    if (contact.type === 'Custom') {
      return contact.customIcon || 'bi bi-person';
    }
    const type = this.contactTypes.find((t) => t.id === contact.type);
    return type?.icon || 'bi bi-person';
  }

  getIconBackground(contact: ContactInfo): string {
    if (contact.type === 'Custom') {
      return contact.customColor || '#6c757d';
    }
    const type = this.contactTypes.find((t) => t.id === contact.type);
    return type?.color || '#6c757d';
  }

  getContactLabel(contact: ContactInfo): string {
    if (contact.type === 'Custom') {
      return contact.customType || 'Custom';
    }
    const type = this.contactTypes.find((t) => t.id === contact.type);
    return type?.label || 'Contact';
  }

  async copyToClipboard(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedIndex = index;
      setTimeout(() => {
        this.copiedIndex = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }

  selectContact(index: number) {
    this.selectedIndex = index;
  }

  onRemove(index: number, event: Event) {
    event.stopPropagation();
    this.remove.emit(index);
  }
}
