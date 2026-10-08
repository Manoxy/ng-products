// shared-imports.ts
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AppDatePipe } from '../pipes/app-date.pipe';
import { AppCurrencyPipe } from '../pipes/app-currency.pipe';
import { MessagesComponent } from '../components/messages/messages.component';
import { LoadingComponent } from '../components/loading/loading.component';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslatePipe,
  AppDatePipe,
  AppCurrencyPipe,
  MessagesComponent,
  LoadingComponent
] as const;
