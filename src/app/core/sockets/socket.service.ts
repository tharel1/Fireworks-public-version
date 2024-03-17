import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = new Socket({
      url: "http://localhost:3000",
      options: {},
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emit(_eventName: string, ..._args: any[]): any {
    return this.socket.emit(_eventName, _args);
  }

  fromEvent<T>(eventName: string): Observable<T> {
    return this.socket.fromEvent(eventName);
  }
}
