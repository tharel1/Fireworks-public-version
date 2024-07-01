import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {catchError, defer, map, Observable, throwError} from "rxjs";
import {JsonType} from "../utils/plain-json.model";
import {Room} from "../models/room.model";
import {FirebaseError} from "@angular/fire/app";
import {FireStoreError} from "../utils/firebase-errors.util";

@Injectable({
  providedIn: 'root'
})
export class RoomRepository {

  private readonly collection: AngularFirestoreCollection<JsonType<Room>>;

  constructor(
    private readonly firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection('rooms');
  }

  find(id: string): Observable<Room | undefined> {
    return this.collection.doc(id).get().pipe(
      map(value => value.data()),
      map(value => value ? Room.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  listen(id: string): Observable<Room | undefined> {
    return this.collection.doc(id).valueChanges().pipe(
      map(value => value ? Room.fromJson(value) : undefined),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  listenAll(): Observable<Room[]> {
    return this.collection.valueChanges().pipe(
      map(value => value.map(r => Room.fromJson(r))),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  create(room: Room): Observable<Room> {
    return defer(() => this.collection.doc(room.id).set(room.toJson())).pipe(
      map(() => room),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  update(room: Room): Observable<Room> {
    return defer(() => this.collection.doc(room.id).set(room.toJson())).pipe(
      map(() => room),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }

  delete(room: Room): Observable<Room> {
    return defer(() => this.collection.doc(room.id).delete()).pipe(
      map(() => room),
      catchError(error => throwError(() => this.convertError(error)))
    );
  }



  private convertError(error: Error): Error {
    if (!(error instanceof FirebaseError))
      return error;

    return new FireStoreError(error.message);
  }

}
