import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ContactColor } from '../../models/contact-type.interface';
import { ContactColor } from 'src/app/models/contact-type.interface';

@Component({
  selector: 'app-custom-type-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="custom-type-creator"
      role="dialog"
      aria-labelledby="customTypeTitle"
    >
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0" id="customTypeTitle">
              Create Custom Contact Type
            </h5>
            <button
              class="btn btn-link text-muted p-0"
              (click)="onCancel()"
              aria-label="Close custom type creator"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="form-floating mb-4">
            <input
              type="text"
              class="form-control"
              [(ngModel)]="customType"
              id="customTypeName"
              placeholder="Enter type name"
              aria-label="Custom contact type name"
              autocomplete="off"
            />
            <label for="customTypeName">Contact Type Name</label>
          </div>

          <div class="mb-4">
            <label class="form-label" id="iconGridLabel">Select Icon</label>
            <div class="icon-grid-container">
              <div
                class="icon-grid"
                role="radiogroup"
                aria-labelledby="iconGridLabel"
              >
                <button
                  *ngFor="let icon of availableIcons"
                  class="icon-btn"
                  [class.active]="selectedIcon === icon"
                  (click)="onIconSelect(icon)"
                  type="button"
                  role="radio"
                  [attr.aria-checked]="selectedIcon === icon"
                  [attr.aria-label]="'Select ' + icon + ' icon'"
                >
                  <i class="bi {{ icon }}" aria-hidden="true"></i>
                  <div class="icon-check" *ngIf="selectedIcon === icon">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </button>
              </div>
              <div class="icon-grid-scroll-indicator">
                <i class="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label" id="colorGridLabel">Select Color</label>
            <div class="color-selection">
              <div
                class="color-grid"
                role="radiogroup"
                aria-labelledby="colorGridLabel"
              >
                <button
                  *ngFor="let color of availableColors"
                  class="color-btn"
                  [class.active]="selectedColor === color.value"
                  (click)="onColorSelect(color.value)"
                  [style.background-color]="'var(--bs-' + color.value + ')'"
                  type="button"
                  role="radio"
                  [attr.aria-checked]="selectedColor === color.value"
                  [attr.aria-label]="'Select ' + color.label + ' color'"
                >
                  <span class="color-preview"></span>
                  <span class="color-label">{{ color.label }}</span>
                  <div
                    class="color-check"
                    *ngIf="selectedColor === color.value"
                  >
                    <i class="bi bi-check-lg"></i>
                  </div>
                </button>

                <!-- Custom Color Button -->
                <button
                  class="color-btn custom-color-btn"
                  [class.active]="isCustomColorActive"
                  (click)="toggleCustomColorPicker()"
                  type="button"
                  role="radio"
                  [attr.aria-checked]="isCustomColorActive"
                  aria-label="Select custom color"
                >
                  <span
                    class="color-preview custom-color-preview"
                    [style.background-color]="customColorValue"
                  >
                    <i class="bi bi-plus-lg" *ngIf="!customColorValue"></i>
                  </span>
                  <span class="color-label">Custom</span>
                  <div class="color-check" *ngIf="isCustomColorActive">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </button>
              </div>

              <!-- Custom Color Picker -->
              <div class="custom-color-picker" *ngIf="isCustomColorActive">
                <div class="input-group">
                  <input
                    type="color"
                    class="form-control form-control-color"
                    [(ngModel)]="customColorValue"
                    (input)="onCustomColorChange($event)"
                    id="customColorPicker"
                    title="Choose your color"
                  />
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="customColorValue"
                    (input)="onCustomColorChange($event)"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button
              class="btn btn-primary flex-grow-1"
              (click)="onAdd()"
              [disabled]="!customType.trim()"
              aria-label="Add custom contact type"
            >
              <i class="bi bi-check-lg me-2" aria-hidden="true"></i>
              Add Type
            </button>
            <button
              class="btn btn-light"
              (click)="onCancel()"
              aria-label="Cancel adding custom type"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CustomTypeCreatorComponent implements OnInit {
  @Input() availableIcons: string[] = [];
  @Input() availableColors: ContactColor[] = [];
  @Output() add = new EventEmitter<{
    type: string;
    icon: string;
    color: string;
  }>();
  @Output() cancel = new EventEmitter<void>();

  customType = '';
  selectedIcon = 'bi-bookmark-star';
  selectedColor = 'primary';
  isCustomColorActive = false;
  customColorValue = '#000000';

  ngOnInit() {
    // Initialize component
  }

  onIconSelect(icon: string) {
    this.selectedIcon = icon;
  }

  onColorSelect(color: string) {
    this.selectedColor = color;
    this.isCustomColorActive = false;
  }

  toggleCustomColorPicker() {
    this.isCustomColorActive = !this.isCustomColorActive;
    if (!this.isCustomColorActive) {
      this.selectedColor = 'primary';
    }
  }

  onCustomColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.match(/^#[0-9A-Fa-f]{6}$/)) {
      this.customColorValue = input.value;
      this.selectedColor = this.customColorValue;
    }
  }

  onAdd() {
    if (this.customType.trim()) {
      this.add.emit({
        type: this.customType.trim(),
        icon: this.selectedIcon,
        color: this.selectedColor,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
