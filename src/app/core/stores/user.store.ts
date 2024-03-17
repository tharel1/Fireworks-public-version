import {Injectable} from '@angular/core';
import {User} from "../../features/users/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  public user: User = User.builder()
    .withId(crypto.randomUUID())
    .withName('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.length)))
    .build();
}
