import { Component, inject } from '@angular/core';
import { TranslateService } from '../../../core/services/translate/translate.service';
import { SHARED_IMPORTS } from '../../imports/shared-imports';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [SHARED_IMPORTS], // <-- Importante incluir la pipe aquí
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  // Inyección opcional si necesitas operar con el servicio
  private translate = inject(TranslateService);
}
