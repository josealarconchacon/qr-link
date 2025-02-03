import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
interface ContactInfo {
  type: string;
  value: string;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
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
