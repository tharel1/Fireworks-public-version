import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../../../core/models/user.model";
import {AuthService} from "../../../../core/services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user$: Observable<User | undefined> = this.authService.user();

  constructor(
    private readonly authService: AuthService
  ) { }
}
