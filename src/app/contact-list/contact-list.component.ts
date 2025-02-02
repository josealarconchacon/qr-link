import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
interface ContactInfo {
  type: string;
  value: string;
}

@Component({
  selector: 'app-contact-list',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Contact List</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let contact of contacts">
            <div mat-line>{{ contact.type }}</div>
            <div mat-line>{{ contact.value }}</div>
            <button
              mat-raised-button
              color="primary"
              (click)="addContact(contact)"
            >
              Add
            </button>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin: 1rem;
      }
      mat-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class ContactListComponent implements OnInit {
  contacts: ContactInfo[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['data']) {
        const decodedData = JSON.parse(decodeURIComponent(params['data']));
        this.contacts = decodedData.contacts;
      }
    });
  }

  addContact(contact: ContactInfo) {
    console.log('Adding contact:', contact);
  }
}
