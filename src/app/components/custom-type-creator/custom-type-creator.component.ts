import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ContactColor } from '../../models/contact-type.interface';
import { ContactColor } from 'src/app/models/contact-type.interface';

@Component({
  selector: 'app-custom-type-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="custom-type-creator">
      <div class="creator-header">
        <h3 class="section-title">Create Custom Contact Type</h3>
        <div class="preview-container">
          <div
            class="type-preview"
            [style.background-color]="
              selectedColor.startsWith('#')
                ? selectedColor
                : 'var(--bs-' + selectedColor + ')'
            "
          >
            <i [class]="'bi ' + selectedIcon"></i>
            <span class="preview-label">{{
              customType || 'Type Preview'
            }}</span>
          </div>
        </div>
      </div>

      <div class="creator-body">
        <div class="input-group">
          <label class="step-label">
            <span class="step-number">1</span>
            <span class="step-text">Name Your Custom Type</span>
          </label>
          <input
            type="text"
            class="name-input"
            [(ngModel)]="customType"
            placeholder="Enter a name for your custom type..."
            autocomplete="off"
          />
        </div>

        <div class="icon-group">
          <label class="step-label">
            <span class="step-number">2</span>
            <span class="step-text">Select an Icon</span>
          </label>
          <div class="icon-selector">
            <button
              *ngFor="let icon of availableIcons"
              class="icon-btn"
              [class.selected]="selectedIcon === icon"
              (click)="onIconSelect(icon)"
            >
              <i class="bi {{ icon }}"></i>
            </button>
          </div>
        </div>

        <div class="color-group">
          <label class="step-label">
            <span class="step-number">3</span>
            <span class="step-text">Choose a Color</span>
          </label>
          <div class="color-selector">
            <button
              *ngFor="let color of availableColors"
              class="color-btn"
              [class.selected]="selectedColor === color.value"
              (click)="onColorSelect(color.value)"
            >
              <div
                class="color-dot"
                [style.background-color]="'var(--bs-' + color.value + ')'"
              ></div>
              <span>{{ color.label }}</span>
            </button>

            <button
              class="color-btn custom-btn"
              [class.selected]="isCustomColorActive"
              (click)="toggleCustomColorPicker()"
            >
              <div
                class="color-dot custom-dot"
                [style.background-color]="customColorValue"
              >
                <i class="bi bi-plus" *ngIf="!customColorValue"></i>
              </div>
              <span>Custom Color</span>
            </button>

            <div class="custom-color-tools" *ngIf="isCustomColorActive">
              <input
                type="color"
                class="color-picker"
                [(ngModel)]="customColorValue"
                (input)="onCustomColorChange($event)"
              />
              <input
                type="text"
                class="color-hex"
                [(ngModel)]="customColorValue"
                (input)="onCustomColorChange($event)"
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="creator-footer">
        <button
          class="create-btn"
          (click)="onAdd()"
          [disabled]="!customType.trim()"
        >
          <i class="bi bi-plus-lg"></i>
          Create Type
        </button>
        <button class="cancel-btn" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-type-creator {
        width: 100%;
        background: var(--bs-body-bg);
        border-radius: 1rem;
        overflow: hidden;
      }

      .creator-header {
        padding: 1.5rem;
        text-align: center;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--bs-primary);
      }

      .preview-container {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
      }

      .type-preview {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1.25rem;
        border-radius: 0.75rem;
        color: white;
        font-size: 1.125rem;
        transition: all 0.3s ease;
      }

      .preview-label {
        font-weight: 500;
      }

      .creator-body {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .step-label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        font-weight: 500;
        color: var(--bs-gray-700);
      }

      .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: var(--bs-primary);
        color: white;
        border-radius: 50%;
        font-size: 0.875rem;
      }

      .name-input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 2px solid var(--bs-gray-200);
        border-radius: 0.75rem;
        transition: all 0.2s ease;
      }

      .name-input:focus {
        outline: none;
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.1);
      }

      .icon-selector {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
        gap: 0.5rem;
        padding: 1rem;
        background: var(--bs-gray-100);
        border-radius: 0.75rem;
      }

      .icon-btn {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        color: var(--bs-gray-600);
        background: var(--bs-body-bg);
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .icon-btn:hover {
        color: var(--bs-primary);
        background: var(--bs-gray-200);
        transform: translateY(-2px);
      }

      .icon-btn.selected {
        color: white;
        background: var(--bs-primary);
      }

      .color-selector {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.75rem;
      }

      .color-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem;
        background: var(--bs-body-bg);
        border: 2px solid var(--bs-gray-200);
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .color-btn:hover {
        border-color: var(--bs-primary);
        transform: translateY(-2px);
      }

      .color-btn.selected {
        border-color: var(--bs-primary);
        background: var(--bs-gray-100);
      }

      .color-dot {
        width: 24px;
        height: 24px;
        border-radius: 0.375rem;
      }

      .custom-dot {
        border: 2px dashed var(--bs-gray-400);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bs-gray-600);
      }

      .custom-color-tools {
        grid-column: 1 / -1;
        display: flex;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--bs-gray-100);
        border-radius: 0.75rem;
        margin-top: 0.5rem;
      }

      .color-picker {
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
      }

      .color-hex {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid var(--bs-gray-200);
        border-radius: 0.375rem;
        font-family: monospace;
        font-size: 0.875rem;
      }

      .creator-footer {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--bs-gray-100);
        border-top: 1px solid var(--bs-gray-200);
      }

      .create-btn,
      .cancel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
        font-weight: 500;
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .create-btn {
        flex: 1;
        color: white;
        background: var(--bs-primary);
      }

      .create-btn:hover:not(:disabled) {
        background: var(--bs-primary-dark, var(--bs-primary));
        transform: translateY(-2px);
      }

      .create-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .cancel-btn {
        color: var(--bs-gray-700);
        background: var(--bs-gray-200);
      }

      .cancel-btn:hover {
        background: var(--bs-gray-300);
      }

      @media (max-width: 768px) {
        .creator-header,
        .creator-body {
          padding: 1.25rem;
        }

        .section-title {
          font-size: 1.125rem;
        }

        .color-selector {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .creator-footer {
          padding: 1.25rem;
        }
      }

      .dark {
        .custom-type-creator {
          background: var(--bs-gray-900);
        }

        .step-label {
          color: var(--bs-gray-300);
        }

        .name-input {
          background: var(--bs-gray-800);
          border-color: var(--bs-gray-700);
          color: var(--bs-gray-200);
        }

        .icon-selector {
          background: var(--bs-gray-800);
        }

        .icon-btn {
          background: var(--bs-gray-900);
          color: var(--bs-gray-400);
        }

        .icon-btn:hover {
          background: var(--bs-gray-700);
        }

        .color-btn {
          background: var(--bs-gray-900);
          border-color: var(--bs-gray-700);
          color: var(--bs-gray-200);
        }

        .custom-color-tools {
          background: var(--bs-gray-800);
        }

        .color-hex {
          background: var(--bs-gray-800);
          border-color: var(--bs-gray-700);
          color: var(--bs-gray-200);
        }

        .creator-footer {
          background: var(--bs-gray-900);
          border-color: var(--bs-gray-800);
        }

        .cancel-btn {
          background: var(--bs-gray-700);
          color: var(--bs-gray-200);
        }

        .cancel-btn:hover {
          background: var(--bs-gray-600);
        }
      }
    `,
  ],
})
export class CustomTypeCreatorComponent {
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
