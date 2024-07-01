import {Component, OnDestroy} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthError, AuthService} from "../../../../core/services/auth.service";
import {MatDividerModule} from "@angular/material/divider";
import {Router, RouterModule} from "@angular/router";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {catchError, EMPTY, merge, Observable, Subscription, tap, throwError} from "rxjs";

@Component({
  selector: 'app-signup',
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
    MatInputModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnDestroy {

  private readonly USER_MAX_LENGTH: number = 15;

  protected formGroup = this.fb.group({
    username: this.fb.control<string>('', [Validators.required, Validators.maxLength(this.USER_MAX_LENGTH)]),
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', [Validators.required])
  });

  protected authError: string = '';
  protected usernameError: string = '';
  protected emailError: string = '';
  protected passwordError: string = '';

  private readonly watcher = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) {

    this.watcher.add(merge(this.formGroup.controls.username.valueChanges, this.formGroup.controls.username.statusChanges).pipe(
      tap(() => this.updateUsernameError())
    ).subscribe());

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

  protected updateUsernameError(): void {
    if (this.formGroup.controls.username.hasError('required')) {
      this.usernameError = 'Username is required.';
    } else if (this.formGroup.controls.username.hasError('maxlength')) {
      this.usernameError = `Username too long (${this.USER_MAX_LENGTH} max).`;
    } else {
      this.usernameError = '';
    }
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

  protected onSignup(): void {
    if (!this.formGroup.valid) {
      this.updateUsernameError();
      this.updateEmailError();
      this.updatePasswordError();
      return;
    }

    const value = this.formGroup.value;

    this.watcher.add(this.authService.signup(value.username ?? '', value.email ?? '', value.password ?? '').pipe(
      tap(() => this.router.navigateByUrl('').then()),
      tap(() => this.snackBarService.success('Fireworks account successfully created!')),
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
