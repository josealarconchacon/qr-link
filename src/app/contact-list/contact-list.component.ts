import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactInfo } from '../models/contact-info';
import { ContactService } from '../services/contact.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="contacts-page">
      <div class="container py-4 py-md-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Header Section -->
            <div
              class="header-section text-center animate__animated animate__fadeIn"
            >
              <h1 class="display-4 fw-bold">Your Digital Business Card</h1>
              <p class="lead text-muted">
                All your contact information in one place
              </p>
            </div>

            <!-- Main Card -->
            <div class="card glass-card animate__animated animate__fadeInUp">
              <!-- Card Header -->
              <div class="card-header">
                <div class="header-content">
                  <div class="header-title">
                    <h5 class="fw-bold">Contact Information</h5>
                    <small class="text-muted fw-medium">
                      {{ contacts.length }} contact{{
                        contacts.length !== 1 ? 's' : ''
                      }}
                    </small>
                  </div>
                  <div class="header-actions">
                    <span class="contact-count">
                      {{ contacts.length }}
                    </span>
                    <button
                      class="btn-icon"
                      (click)="refreshContacts()"
                      title="Refresh contacts"
                    >
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact List -->
              <div class="contact-list">
                <!-- Contact Items -->
                <div
                  *ngFor="let contact of contacts; let i = index"
                  class="contact-item"
                  [class.is-hovered]="hoveredIndex === i"
                  [class.is-selected]="selectedIndex === i"
                  (mouseenter)="hoveredIndex = i"
                  (mouseleave)="hoveredIndex = null"
                  (click)="selectContact(i)"
                  role="button"
                  tabindex="0"
                >
                  <div class="contact-item-content">
                    <!-- Contact Icon -->
                    <div
                      class="contact-icon"
                      [style.background-color]="getIconBackground(contact)"
                    >
                      <i [class]="getContactIcon(contact)"></i>
                    </div>

                    <!-- Contact Details -->
                    <div class="contact-details">
                      <div class="contact-value">
                        {{ contact.value }}
                        <span
                          class="copied-badge"
                          [class.is-visible]="copiedIndex === i"
                        >
                          Copied!
                        </span>
                      </div>
                      <div class="contact-type">
                        {{ getDisplayType(contact) }}
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="contact-actions">
                      <button
                        class="btn-icon"
                        (click)="copyContact(contact); $event.stopPropagation()"
                        [attr.aria-label]="'Copy ' + contact.value"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                      <button
                        class="btn-icon btn-danger"
                        (click)="removeContact(i); $event.stopPropagation()"
                        [attr.aria-label]="'Remove ' + getDisplayType(contact)"
                      >
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  *ngIf="!contacts?.length"
                  class="empty-state animate__animated animate__fadeIn"
                >
                  <div class="empty-state-icon">
                    <i class="bi bi-person-lines-fill"></i>
                  </div>
                  <h5>No contacts yet</h5>
                  <p>Add some contacts to get started!</p>
                  <button class="btn btn-primary" routerLink="/set-user-info">
                    <i class="bi bi-plus-circle"></i>
                    Add Your First Contact
                  </button>
                </div>
              </div>
            </div>

            <!-- Clear All Button -->
            <div
              *ngIf="contacts?.length"
              class="clear-all-section animate__animated animate__fadeInUp"
            >
              <button class="btn btn-danger" (click)="clearAllContacts()">
                <i class="bi bi-trash3"></i>
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
      /* Base Layout */
      .contacts-page {
        min-height: 100vh;
        background-color: var(--bg-primary);
        padding: var(--spacing-xl) 0;
      }

      /* Header Section */
      .header-section {
        margin-bottom: var(--spacing-xl);
      }

      .header-section h1 {
        color: var(--text-primary);
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        margin-bottom: var(--spacing-sm);
        line-height: 1.2;
      }

      .header-section .lead {
        color: var(--text-secondary);
        font-size: clamp(1rem, 2vw, 1.125rem);
        margin-bottom: 0;
      }

      /* Card Styles */
      .glass-card {
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: transform 0.3s var(--transition-timing);
      }

      .glass-card:hover {
        transform: translateY(-2px);
      }

      /* Card Header */
      .card-header {
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--border-color);
        background-color: var(--bg-secondary);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-title h5 {
        color: var(--text-primary);
        font-size: 1.25rem;
        margin-bottom: var(--spacing-xs);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .contact-count {
        background-color: var(--accent-color);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius);
        font-weight: 600;
        min-width: 2rem;
        text-align: center;
      }

      /* Contact List */
      .contact-list {
        background-color: var(--bg-secondary);
      }

      /* Contact Item */
      .contact-item {
        position: relative;
        transition: background-color 0.2s var(--transition-timing);
        cursor: pointer;
      }

      .contact-item:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }

      .contact-item.is-hovered {
        background-color: var(--hover-color);
      }

      .contact-item.is-selected {
        border-left: 4px solid var(--accent-color);
      }

      .contact-item-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md) var(--spacing-lg);
      }

      /* Contact Icon */
      .contact-icon {
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s var(--transition-timing);
      }

      .contact-icon i {
        color: white;
        font-size: 1.25rem;
      }

      .contact-item:hover .contact-icon {
        transform: scale(1.05);
      }

      /* Contact Details */
      .contact-details {
        flex: 1;
        min-width: 0;
      }

      .contact-value {
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);
      }

      .contact-type {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      /* Copied Badge */
      .copied-badge {
        background-color: var(--success-color);
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
        opacity: 0;
        transition: opacity 0.2s var(--transition-timing);
      }

      .copied-badge.is-visible {
        opacity: 1;
      }

      /* Action Buttons */
      .contact-actions {
        display: flex;
        gap: var(--spacing-sm);
        opacity: 0;
        transition: opacity 0.2s var(--transition-timing);
      }

      .contact-item:hover .contact-actions {
        opacity: 1;
      }

      /* Button Styles */
      .btn-icon {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        border: 1px solid var(--border-color);
        border-radius: 50%;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s var(--transition-timing);
        cursor: pointer;
      }

      .btn-icon:hover {
        transform: scale(1.1);
        background-color: var(--hover-color);
      }

      .btn-icon i {
        font-size: 1.125rem;
      }

      .btn-icon.btn-danger {
        color: var(--danger-color);
        border-color: var(--danger-color);
      }

      .btn-icon.btn-danger:hover {
        background-color: var(--danger-color);
        color: white;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: var(--spacing-xl);
      }

      .empty-state-icon {
        font-size: 3rem;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
      }

      .empty-state h5 {
        color: var(--text-primary);
        font-size: 1.25rem;
        margin-bottom: var(--spacing-sm);
      }

      .empty-state p {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
      }

      /* Clear All Section */
      .clear-all-section {
        text-align: center;
        margin-top: var(--spacing-xl);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius);
        font-weight: 500;
        transition: all 0.2s var(--transition-timing);
      }

      .btn i {
        font-size: 1.125rem;
      }

      .btn-primary {
        background-color: var(--accent-color);
        color: white;
        border: none;
      }

      .btn-primary:hover {
        background-color: var(--accent-dark);
        transform: translateY(-1px);
      }

      .btn-danger {
        background-color: transparent;
        color: var(--danger-color);
        border: 1px solid var(--danger-color);
      }

      .btn-danger:hover {
        background-color: var(--danger-color);
        color: white;
        transform: translateY(-1px);
      }

      /* Responsive Styles */
      @media (max-width: 576px) {
        .contacts-page {
          padding: var(--spacing-md) 0;
        }

        .glass-card {
          border-radius: var(--radius);
        }

        .card-header {
          padding: var(--spacing-sm) var(--spacing-md);
        }

        .contact-item-content {
          padding: var(--spacing-sm) var(--spacing-md);
          gap: var(--spacing-sm);
        }

        .contact-icon {
          width: 2.5rem;
          height: 2.5rem;
        }

        .contact-icon i {
          font-size: 1rem;
        }

        .btn-icon {
          width: 2rem;
          height: 2rem;
        }

        .btn-icon i {
          font-size: 1rem;
        }

        .empty-state {
          padding: var(--spacing-lg);
        }

        .empty-state-icon {
          font-size: 2.5rem;
        }
      }

      @media (min-width: 577px) and (max-width: 768px) {
        .contact-icon {
          width: 2.75rem;
          height: 2.75rem;
        }

        .btn-icon {
          width: 2.25rem;
          height: 2.25rem;
        }
      }
    `,
  ],
})
export class ContactListComponent implements OnInit, OnDestroy, AfterViewInit {
  contacts: ContactInfo[] = [];
  hoveredIndex: number | null = null;
  selectedIndex: number | null = null;
  copiedIndex: number | null = null;
  private contactSubscription: Subscription;

  constructor(private contactService: ContactService) {
    this.contactSubscription = this.contactService.contacts$.subscribe(
      (contacts) => {
        this.contacts = contacts;
      }
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
  }

  getContactIcon(contact: ContactInfo): string {
    if (contact.type === 'Custom' && contact.customIcon) {
      return contact.customIcon;
    }

    const iconMap: { [key: string]: string } = {
      Phone: 'bi bi-phone',
      Email: 'bi bi-envelope',
      LinkedIn: 'bi bi-linkedin',
      GitHub: 'bi bi-github',
      Website: 'bi bi-globe',
      Twitter: 'bi bi-twitter',
      Instagram: 'bi bi-instagram',
    };

    return iconMap[contact.type] || 'bi bi-person';
  }

  getIconBackground(contact: ContactInfo): string {
    if (contact.type === 'Custom' && contact.customColor) {
      return `var(--${contact.customColor})`;
    }

    const colorMap: { [key: string]: string } = {
      Phone: 'var(--success-color)',
      Email: 'var(--primary-color)',
      LinkedIn: 'var(--info-color)',
      GitHub: 'var(--dark-color)',
      Website: 'var(--purple-color)',
      Twitter: 'var(--info-color)',
      Instagram: 'var(--danger-color)',
    };

    return colorMap[contact.type] || 'var(--accent-color)';
  }

  getDisplayType(contact: ContactInfo): string {
    return contact.type === 'Custom'
      ? contact.customType || 'Custom'
      : contact.type;
  }

  selectContact(index: number): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  copyContact(contact: ContactInfo): void {
    navigator.clipboard.writeText(contact.value).then(() => {
      const index = this.contacts.indexOf(contact);
      this.copiedIndex = index;
      setTimeout(() => {
        if (this.copiedIndex === index) {
          this.copiedIndex = null;
        }
      }, 2000);
    });
  }

  removeContact(index: number): void {
    const updatedContacts = [...this.contacts];
    updatedContacts.splice(index, 1);
    this.contactService.updateContacts(updatedContacts);
  }

  clearAllContacts(): void {
    this.contactService.updateContacts([]);
  }

  refreshContacts(): void {
    // Trigger a refresh animation or reload if needed
    this.selectedIndex = null;
    this.hoveredIndex = null;
  }
}
