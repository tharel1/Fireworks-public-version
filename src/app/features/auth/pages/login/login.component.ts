import {Component, OnDestroy} from '@angular/core';
import {AuthError, AuthService} from "../../../../core/services/auth.service";
import {MatCardModule} from "@angular/material/card";
import {Router, RouterModule} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, EMPTY, merge, Observable, Subscription, tap, throwError} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    NgOptimizedImage,
    MatButtonModule,
    RouterModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  protected formGroup = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', [Validators.required]),
  });

  protected authError: string = '';
  protected emailError: string = '';
  protected passwordError: string = '';

  private readonly watcher = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {

    this.watcher.add(merge(this.formGroup.controls.email.valueChanges, this.formGroup.controls.email.statusChanges).pipe(
      tap(() => this.updateEmailError())
    ).subscribe());

    this.watcher.add(merge(this.formGroup.controls.password.valueChanges, this.formGroup.controls.password.statusChanges).pipe(
      tap(() => this.updatePasswordError())
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  protected updateEmailError(): void {
    if (this.formGroup.controls.email.hasError('required')) {
      this.emailError = 'Email is required.';
    } else if (this.formGroup.controls.email.hasError('email')) {
      this.emailError = 'Email not valid.'
    } else {
      this.emailError = '';
    }
  }

  protected updatePasswordError(): void {
    if (this.formGroup.controls.password.hasError('required')) {
      this.passwordError = 'Password is required.';
    } else {
      this.passwordError = '';
    }
  }

  protected onLogin(): void {
    if (!this.formGroup.valid) {
      this.updateEmailError();
      this.updatePasswordError();
      return;
    }

    const value = this.formGroup.value;

    this.watcher.add(this.authService.login(value.email ?? '', value.password ?? '').pipe(
      tap(() => this.router.navigateByUrl('').then()),
      catchError(error => this.handleAuthError(error))
    ).subscribe());
  }

  protected onSignupWithGoogle(): void {
    this.watcher.add(this.authService.signupWithGoogle().pipe(
      tap(() => this.router.navigateByUrl('').then()),
      catchError(error => this.handleAuthError(error))
    ).subscribe());
  }

  private handleAuthError(error?: Error): Observable<never> {
    if (error instanceof AuthError) {
      this.authError = error.message;
      return EMPTY;
    }

    return throwError(() => error);
  }

}
