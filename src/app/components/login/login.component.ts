import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/imports/shared-imports';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoadingService } from '../../core/services/loading/loading.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/models/shared-structure.model';
import { MessagesService } from '../../core/services/messages/messages.service';
import { TranslateService } from '../../core/services/translate/translate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DEFAULT_ERROR } from '../../shared/constants/AppConstants';

@Component({
  imports: [SHARED_IMPORTS, LogoComponent],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private loadingService: LoadingService = inject(LoadingService);
  private subscriptions: Subscription = new Subscription();
  private messageService: MessagesService = inject(MessagesService);
  public translate: TranslateService = inject(TranslateService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.logoutAndRemoveAll();
  }

  getLoginRequest(): LoginRequest {
    let request: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    } as LoginRequest;
    return request;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loadingService.toggleIndicator(true);
      this.subscriptions.add(
        this.authService.login(this.getLoginRequest()).subscribe({
          next: (data: LoginResponse) => {
            this.loadingService.toggleIndicator(false);

            // 1. Guardar token/sesión en storage o signal
            this.authService.setLoginData(data);

            // 2. Navegar directamente
            this.router.navigate(['/home']);
            this.messageService.success('LOGIN.MESSAGES.OK_LOGIN');
          },
          error: (err: HttpErrorResponse) => {
            this.loadingService.toggleIndicator(false);
            this.messageService.error(
              err && err.error && err.error.code
                ? 'LOGIN.MESSAGES.' + err.error.code
                : DEFAULT_ERROR,
            );
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
