// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ContactForm } from './components/contact-form/contact-form';
import { ContactListComponent } from './components/contact-list/contact-list';

export const routes: Routes = [
  { path: '', component: ContactForm },
  { path: 'contacts', component: ContactListComponent }
];
