import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ContactType } from '../../models/contact-type.interface';
import { ContactType } from 'src/app/models/contact-info';

@Component({
  selector: 'app-contact-type-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-type-wrapper">
      <div
        class="contact-type-container"
        role="group"
        aria-label="Contact type selection"
      >
        <div class="contact-type-grid">
          <button
            *ngFor="let type of contactTypes"
            class="contact-type-btn"
            [class.active]="selectedType === type.id"
            (click)="onTypeSelect(type.id)"
            [attr.aria-label]="'Select ' + type.label + ' contact type'"
            [attr.aria-pressed]="selectedType === type.id"
          >
            <div class="contact-type-icon" [ngClass]="'bg-' + type.color">
              <i [class]="type.icon + ' text-white'" aria-hidden="true"></i>
            </div>
            <span class="contact-type-label">{{ type.label }}</span>
          </button>

          <button
            class="contact-type-btn add-custom-btn"
            (click)="onTypeSelect('Custom')"
            *ngIf="!isAddingCustom"
            aria-label="Add custom contact type"
          >
            <div class="contact-type-icon bg-warning">
              <i class="bi bi-plus-lg text-white" aria-hidden="true"></i>
            </div>
            <span class="contact-type-label">Add Custom</span>
          </button>
        </div>
      </div>
      <div class="custom-type-container" *ngIf="isAddingCustom">
        <div class="custom-type-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../styles/components/contact-type-selector.css'],
})
export class ContactTypeSelectorComponent {
  @Input() contactTypes: ContactType[] = [];
  @Input() selectedType: string = '';
  @Input() isAddingCustom: boolean = false;
  @Output() typeSelect = new EventEmitter<string>();

  onTypeSelect(type: string) {
    this.typeSelect.emit(type);
  }
}
