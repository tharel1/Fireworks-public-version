import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {catchError, defer, map, Observable, throwError} from "rxjs";
import {JsonType} from "../utils/plain-json.model";
import {User} from "../models/user.model";
import {FirebaseError} from "@angular/fire/app";
import {FireStoreError} from "../utils/firebase-errors.util";

@Injectable({
  providedIn: 'root'
})
export class UserRepository {

  private readonly collection: AngularFirestoreCollection<JsonType<User>>;

  constructor(
    private readonly firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection('users');
  }

  find(id: string): Observable<User | undefined> {
    return this.collection.doc(id).get().pipe(
      map(value => value.data()),
      map(value => value ? User.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  listen(id: string): Observable<User | undefined> {
    return this.collection.doc(id).valueChanges().pipe(
      map(value => value ? User.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  create(user: User): Observable<User> {
    return defer(() => this.collection.doc(user.id).set(user.toJson())).pipe(
      map(() => user),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  update(user: User): Observable<User> {
    return defer(() => this.collection.doc(user.id).set(user.toJson())).pipe(
      map(() => user),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  delete(user: User): Observable<User> {
    return defer(() => this.collection.doc(user.id).delete()).pipe(
      map(() => user),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }



  private convertError(error: Error): Error {
    if (!(error instanceof FirebaseError))
      return error;

    return new FireStoreError(error.message);
  }

}
