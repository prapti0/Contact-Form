

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ContactService } from '../../services/contact';
import { Contact } from '../../models/contact';
import { PagedResponse } from '../../models/paged-response';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-contact-list',
  standalone: true,
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class ContactListComponent implements OnInit {
  // ─── Template References ─────────────────────────────────────────────
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ─── Table & UI State ───────────────────────────────────────────────
  displayedColumns: string[] = ['name', 'email', 'phoneNumber', 'jobTitle', 'company', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Contact>();

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  sortBy = 'id';
  sortDir: 'asc' | 'desc' = 'asc';
  searchTerm = '';

  isLoading = false;

  // ─── Reactive Search Input ──────────────────────────────────────────
  private searchSubject = new Subject<string>();

  // ─── Constructor ────────────────────────────────────────────────────
  constructor(
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.pageIndex = 0;
      this.loadContacts();
    });
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadContacts();
  }

  // ─── API: Load Paginated Contacts ───────────────────────────────────
  loadContacts(): void {
    this.isLoading = true;

    this.contactService.getContacts(
      this.pageIndex,
      this.pageSize,
      this.sortBy,
      this.sortDir,
      this.searchTerm
    ).subscribe({
      next: (response: PagedResponse<Contact>) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.snackBar.open('Error loading contacts', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  // ─── UI: Pagination ─────────────────────────────────────────────────
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  // ─── UI: Sorting ────────────────────────────────────────────────────
  onSortChange(sortState: Sort): void {
    this.sortBy = sortState.active;
    this.sortDir = (sortState.direction || 'asc') as 'asc' | 'desc';
    this.pageIndex = 0;
    this.loadContacts();
  }

  // ─── UI: Search Input ───────────────────────────────────────────────
  onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  // ─── API: Delete Contact ────────────────────────────────────────────
  deleteContact(contact: Contact): void {
    if (contact.id === undefined) {
      console.error('Contact ID is undefined.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      this.contactService.deleteContact(contact.id).subscribe({
        next: () => {
          this.snackBar.open('Contact deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadContacts();
        },
        error: (error) => {
          console.error('Error deleting contact:', error);
          this.snackBar.open('Error deleting contact', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  refreshContacts(): void {
    this.pageIndex = 0;
    this.searchTerm = '';
    this.loadContacts();
  }
}
