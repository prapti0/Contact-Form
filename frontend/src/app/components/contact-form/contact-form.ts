// src/app/components/contact-form/contact-form.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Domain model and service
import { ContactRequest } from '../../models/contact';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ContactForm {
  /** Emits an event to refresh the contact list on successful form submit */
  @Output() contactAdded = new EventEmitter<void>();

  /** Reactive form instance */
  contactForm: FormGroup;

  /** Spinner flag for submit button */
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.buildForm();
  }

  // ----------------------- FORM INITIALIZATION -----------------------

  /** Builds and returns the reactive form group with validation rules */
  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      company: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  // ----------------------- FORM SUBMIT HANDLER -----------------------

  /** Triggered on form submit */
  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const payload: ContactRequest = this.contactForm.value as ContactRequest;

    this.contactService.createContact(payload).subscribe({
      next: () => {
        this.snackBar.open('Contact created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Reset form and emit event to parent
        this.contactForm.reset();
        this.contactForm.markAsPristine();
        this.contactForm.markAsUntouched();
        this.contactAdded.emit();
      },
      error: (err: unknown) => {
        console.error('Error creating contact:', err);
        this.snackBar.open('Error creating contact. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // ----------------------- VALIDATION HELPERS -----------------------

  /** Returns error message for a form field */
  getFieldError(fieldName: string): string {
    const ctrl = this.contactForm.get(fieldName);
    if (!ctrl || !ctrl.errors || !ctrl.touched) return '';

    if (ctrl.errors['required']) return `${fieldName} is required`;
    if (ctrl.errors['email']) return 'Please enter a valid email';
    if (ctrl.errors['maxlength']) return `${fieldName} is too long`;

    return '';
  }

  /** Checks if a field is invalid and touched */
  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.contactForm.get(fieldName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
