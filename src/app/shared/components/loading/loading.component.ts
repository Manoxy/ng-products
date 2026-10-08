import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  imports: [],
  selector: 'app-loading',
  styleUrl: './loading.component.scss',
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  protected readonly loadingService: LoadingService = inject(LoadingService);
}
