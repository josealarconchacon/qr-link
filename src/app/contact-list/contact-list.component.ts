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
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy, AfterViewInit {
  contacts: ContactInfo[] = [];
  private subscription: Subscription | undefined;

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

  removeContact(index: number) {
    const updatedContacts = [...this.contacts];
    updatedContacts.splice(index, 1);
    this.contactService.updateContacts(updatedContacts);
  }

  clearAllContacts() {
    this.contactService.clearContacts();
  }

  async copyContact(contact: ContactInfo) {
    const text = `${this.getDisplayType(contact)}: ${contact.value}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy contact:', err);
    }
  }
}
