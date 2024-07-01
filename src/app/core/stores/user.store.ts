import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {Observable, of, tap} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private user?: User;

  constructor(
    private readonly authService: AuthService
  ) { }

  get(): Observable<User | undefined> {
    return this.user
      ? of(this.user)
      : this.authService.user().pipe(tap(user => this.user = user));
  }
}
