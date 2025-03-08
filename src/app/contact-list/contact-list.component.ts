import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfo } from '../models/contact-info';
import { ContactService } from '../services/contact.service';
import { Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contacts-page">
      <div class="container py-4 py-md-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Header Section -->
            <div
              class="text-center mb-4 mb-md-5 animate__animated animate__fadeIn"
            >
              <h1 class="display-4 fw-bold mb-3">Your Digital Business Card</h1>
              <p class="lead text-muted">
                All your contact information in one place
              </p>
            </div>

            <!-- Main Card -->
            <div
              class="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp"
            >
              <div class="card-header bg-white py-3 px-4 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="mb-1 fw-bold text-dark">Contact Information</h5>
                    <small class="text-muted d-block fw-medium">
                      {{ contacts.length }} contact{{
                        contacts.length !== 1 ? 's' : ''
                      }}
                    </small>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <span
                      class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2"
                    >
                      {{ contacts.length }}
                    </span>
                    <button
                      class="btn btn-outline-primary rounded-circle p-2"
                      (click)="refreshContacts()"
                      title="Refresh contacts"
                    >
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact List -->
              <div class="list-group list-group-flush">
                <div
                  *ngFor="let contact of contacts; let i = index"
                  class="list-group-item px-4 py-3 animate__animated animate__fadeInUp"
                  [class.animate__delay-1s]="i > 0"
                  [class.animate__delay-2s]="i > 1"
                  [class.animate__delay-3s]="i > 2"
                  [class.bg-light]="hoveredIndex === i"
                  [class.border-primary-subtle]="selectedIndex === i"
                  [class.border-start]="selectedIndex === i"
                  (mouseenter)="hoveredIndex = i"
                  (mouseleave)="hoveredIndex = null"
                  (click)="selectContact(i)"
                  role="button"
                  tabindex="0"
                >
                  <div class="d-flex align-items-center gap-3">
                    <!-- Contact Icon -->
                    <div
                      class="contact-icon flex-shrink-0 position-relative shadow-sm"
                      [style.background-color]="getIconBackground(contact)"
                    >
                      <i
                        [class]="getContactIcon(contact)"
                        class="text-white position-absolute top-50 start-50 translate-middle"
                        aria-hidden="true"
                      ></i>
                    </div>

                    <!-- Contact Details -->
                    <div class="flex-grow-1 min-w-0">
                      <div class="d-flex align-items-center gap-2">
                        <div class="text-truncate fw-semibold text-dark">
                          {{ contact.value }}
                        </div>
                        <span
                          class="copied-text badge bg-success-subtle text-success fw-medium ms-auto"
                          [class.d-none]="!copiedIndex || copiedIndex !== i"
                        >
                          Copied!
                        </span>
                      </div>
                      <small class="text-muted d-block text-truncate fw-medium">
                        {{ getDisplayType(contact) }}
                      </small>
                    </div>

                    <!-- Action Buttons -->
                    <div
                      class="action-buttons d-flex align-items-center gap-2 flex-shrink-0"
                    >
                      <button
                        class="btn btn-sm btn-outline-primary rounded-circle p-2"
                        (click)="copyContact(contact); $event.stopPropagation()"
                        [attr.aria-label]="'Copy ' + contact.value"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger rounded-circle p-2"
                        (click)="removeContact(i); $event.stopPropagation()"
                        [attr.aria-label]="'Remove ' + getDisplayType(contact)"
                      >
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div
                *ngIf="!contacts?.length"
                class="text-center py-5 animate__animated animate__fadeIn"
              >
                <div class="empty-state-icon mb-4">
                  <i class="bi bi-person-lines-fill text-muted opacity-75"></i>
                </div>
                <h5 class="text-muted mb-3">No contacts yet</h5>
                <p class="text-muted mb-4">Add some contacts to get started!</p>
                <button
                  class="btn btn-primary btn-lg"
                  routerLink="/set-user-info"
                >
                  <i class="bi bi-plus-circle me-2"></i>
                  Add Your First Contact
                </button>
              </div>
            </div>

            <!-- Clear All Button -->
            <div
              *ngIf="contacts?.length"
              class="text-center mt-4 animate__animated animate__fadeInUp"
            >
              <button
                class="btn btn-outline-danger btn-lg"
                (click)="clearAllContacts()"
              >
                <i class="bi bi-trash3 me-2"></i>
                Clear All Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .contacts-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
        padding: 2rem 0;
      }

      .card {
        transition: all 0.3s ease;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1) !important;
      }

      .contact-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .list-group-item {
        border: none;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .list-group-item:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .list-group-item.border-start {
        border-left-width: 4px !important;
      }

      .action-buttons {
        opacity: 0;
        transition: all 0.2s ease;
      }

      .list-group-item:hover .action-buttons {
        opacity: 1;
      }

      .btn-sm {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .btn-sm:hover {
        transform: scale(1.1);
      }

      .copied-text {
        transition: all 0.2s ease;
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
      }

      .empty-state-icon {
        font-size: 4rem;
      }

      @media (prefers-color-scheme: dark) {
        .contacts-page {
          background: linear-gradient(135deg, #1a1f36 0%, #2d3748 100%);
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
        }

        .list-group-item {
          background: transparent;
        }

        .list-group-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .text-dark {
          color: #f8fafc !important;
        }

        .text-muted {
          color: #94a3b8 !important;
        }
      }

      @media (max-width: 576px) {
        .contacts-page {
          padding: 1rem 0;
        }

        .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .contact-icon {
          width: 2.5rem;
          height: 2.5rem;
        }

        .btn-sm {
          width: 2rem;
          height: 2rem;
        }

        .copied-text {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
        }
      }

      @media (min-width: 576px) and (max-width: 768px) {
        .contact-icon {
          width: 2.75rem;
          height: 2.75rem;
        }

        .btn-sm {
          width: 2.25rem;
          height: 2.25rem;
        }
      }
    `,
  ],
})
export class ContactListComponent implements OnInit, OnDestroy, AfterViewInit {
  contacts: ContactInfo[] = [];
  private subscription: Subscription | undefined;
  hoveredIndex: number | null = null;
  selectedIndex: number | null = null;
  copiedIndex: number | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription = this.contactService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  getIconBackground(contact: ContactInfo): string {
    const colorMap: { [key: string]: string } = {
      Phone: '#10B981',
      Email: '#3B82F6',
      LinkedIn: '#0EA5E9',
      GitHub: '#1F2937',
      Website: '#8B5CF6',
      Twitter: '#0EA5E9',
      Instagram: '#EF4444',
    };

    if (contact.type === 'Custom' && contact.customColor) {
      return `var(--bs-${contact.customColor})`;
    }

    return colorMap[contact.type] || '#3B82F6';
  }

  selectContact(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  async copyContact(contact: ContactInfo) {
    const text = `${this.getDisplayType(contact)}: ${contact.value}`;
    try {
      await navigator.clipboard.writeText(text);
      this.copiedIndex = this.contacts.indexOf(contact);
      setTimeout(() => (this.copiedIndex = null), 2000);
    } catch (err) {
      console.error('Failed to copy contact:', err);
    }
  }

  removeContact(index: number) {
    const updatedContacts = [...this.contacts];
    updatedContacts.splice(index, 1);
    this.contactService.updateContacts(updatedContacts);
  }

  clearAllContacts() {
    this.contactService.clearContacts();
  }

  refreshContacts() {
    const savedContacts = localStorage.getItem('userContacts');
    if (savedContacts) {
      try {
        const contacts = JSON.parse(savedContacts);
        this.contactService.updateContacts(contacts);
      } catch (error) {
        console.error('Error refreshing contacts:', error);
      }
    }
  }
}
