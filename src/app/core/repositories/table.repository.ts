import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {catchError, defer, map, Observable, throwError} from "rxjs";
import {JsonType} from "../utils/plain-json.model";
import {Table} from "../models/table.model";
import {FirebaseError} from "@angular/fire/app";
import {FireStoreError} from "../utils/firebase-errors.util";

@Injectable({
  providedIn: 'root'
})
export class TableRepository {

  private readonly collection: AngularFirestoreCollection<JsonType<Table>>;

  constructor(
    private readonly firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection('tables');
  }

  find(id: string): Observable<Table | undefined> {
    return this.collection.doc(id).get().pipe(
      map(value => value.data()),
      map(value => value ? Table.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  listen(id: string): Observable<Table | undefined> {
    return this.collection.doc(id).valueChanges().pipe(
      map(value => value ? Table.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  listenAll(): Observable<Table[]> {
    return this.collection.valueChanges().pipe(
      map(value => value.map(r => Table.fromJson(r))),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  create(table: Table): Observable<Table> {
    return defer(() => this.collection.doc(table.id).set(table.toJson())).pipe(
      map(() => table),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  update(table: Table): Observable<Table> {
    return defer(() => this.collection.doc(table.id).set(table.toJson())).pipe(
      map(() => table),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  delete(table: Table): Observable<Table> {
    return defer(() => this.collection.doc(table.id).delete()).pipe(
      map(() => table),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }



  private convertError(error: Error): Error {
    if (!(error instanceof FirebaseError))
      return error;

    return new FireStoreError(error.message);
  }

}
