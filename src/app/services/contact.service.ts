import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactInfo } from '../models/contact-info';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSubject = new BehaviorSubject<ContactInfo[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor() {
    // Load contacts from localStorage on service initialization
    const savedContacts = localStorage.getItem('userContacts');
    if (savedContacts) {
      try {
        const contacts = JSON.parse(savedContacts);
        this.contactsSubject.next(contacts);
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
        this.contactsSubject.next([]);
      }
    }
  }

  addContact(contact: ContactInfo) {
    const currentContacts = this.contactsSubject.value;
    const updatedContacts = [...currentContacts, contact];
    this.contactsSubject.next(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  updateContacts(contacts: ContactInfo[]) {
    this.contactsSubject.next(contacts);
    this.saveToLocalStorage(contacts);
  }

  getContacts(): Observable<ContactInfo[]> {
    return this.contacts$;
  }

  clearContacts() {
    this.contactsSubject.next([]);
    this.saveToLocalStorage([]);
  }

  private saveToLocalStorage(contacts: ContactInfo[]) {
    try {
      localStorage.setItem('userContacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to localStorage:', error);
    }
  }
}
