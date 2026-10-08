import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../imports/shared-imports';
import { AuthService } from '../../../core/services/auth/auth.service';
import { OnInit } from '@angular/core';

@Component({
  imports: [SHARED_IMPORTS],
  selector: 'app-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  public date = '';
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const currentYear: number  = new Date().getFullYear();
    const previousYear: number = currentYear - 1;
    this.date = previousYear.toString() + '-' + currentYear.toString();
  }
}
