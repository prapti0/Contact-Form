// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ContactRequest } from '../models/contact';
import { PagedResponse } from '../models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:9090/api/contacts';

  constructor(private http: HttpClient) { }

  createContact(contact: ContactRequest): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  getContacts(
    page: number = 0, 
    size: number = 10, 
    sortBy: string = 'id', 
    sortDir: string = 'asc', 
    search: string = ''
  ): Observable<PagedResponse<Contact>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir)
      .set('search', search);

    return this.http.get<PagedResponse<Contact>>(this.apiUrl, { params });
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  updateContact(id: number, contact: ContactRequest): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}