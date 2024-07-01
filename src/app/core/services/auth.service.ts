import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {catchError, defer, EMPTY, map, mergeMap, Observable, of, throwError} from "rxjs";
import {GoogleAuthProvider} from "@firebase/auth";
import {FirebaseError} from "@angular/fire/app";
import {FireAuthError} from "../utils/firebase-errors.util";
import {UserRepository} from "../repositories/user.repository";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly userRepository: UserRepository
  ) { }

  signup(username: string, email: string, password: string): Observable<undefined> {
    return defer(() => this.fireAuth.createUserWithEmailAndPassword(email, password)).pipe(
      mergeMap(userCredential => {
        const user = userCredential.user;
        if (!user || !username) return EMPTY;
        user.updateProfile({displayName: username}).then();
        return this.createUserIfAbsent(user.uid, username);
      }),
      map(() => undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  signupWithGoogle(): Observable<undefined> {
    return defer(() => this.fireAuth.signInWithPopup(new GoogleAuthProvider())).pipe(
      mergeMap(userCredential => {
        const user = userCredential.user;
        if (!user) return EMPTY;
        return this.createUserIfAbsent(user.uid, user.displayName ?? '');
      }),
      map(() => undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  login(email: string, password: string): Observable<undefined> {
    return defer(() => this.fireAuth.signInWithEmailAndPassword(email, password)).pipe(
      map(() => undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  logout(): Observable<undefined> {
    return defer(() => this.fireAuth.signOut()).pipe(
      map(() => undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  user(): Observable<User | undefined> {
    return this.fireAuth.authState.pipe(
      mergeMap(user => this.userRepository.find(user?.uid ?? '')),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.fireAuth.authState.pipe(
      map((user) => !!user),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }



  private createUserIfAbsent(id: string, name: string): Observable<User> {
    return this.userRepository.find(id).pipe(
      mergeMap(user => user
        ? of(User.empty())
        : this.userRepository.create(User.builder()
          .withId(id)
          .withName(name)
          .build())
      )
    );
  }

  private convertError(error: Error): Error {
    if (!(error instanceof FirebaseError))
      return error;

    let message: string = '';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email address already in use.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Incorrect email or password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many requests to log into this account.';
        break;
      case 'auth/user-disabled':
        message = 'User disabled.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Server error, please try again later.';
        break;

      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        message = '';
        break;

      default:
        return new FireAuthError(error.message);
    }

    return new AuthError(message);
  }

}

export class AuthError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
