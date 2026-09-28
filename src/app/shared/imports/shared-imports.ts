// shared-imports.ts
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AppDatePipe } from '../pipes/app-date.pipe';
import { AppCurrencyPipe } from '../pipes/app-currency.pipe';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslatePipe,
  AppDatePipe,
  AppCurrencyPipe
] as const;
