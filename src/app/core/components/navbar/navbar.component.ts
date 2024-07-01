import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {Theme, ThemingService} from "../../services/theming.service";
import {AuthService} from "../../services/auth.service";
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatButton,
    NgOptimizedImage,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    MatMenuTrigger,
    MatTooltip,
    MatMenu,
    MatMenuItem
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges, OnDestroy {

  protected authenticated: boolean = false;
  protected currentTheme: Theme = Theme.DARK;

  private readonly watcher = new Subscription();

  protected readonly Theme = Theme;

  constructor(
    private readonly authService: AuthService,
    private readonly themingService: ThemingService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.watcher.add(this.authService.isAuthenticated().pipe(
      tap((authenticated) => this.authenticated = authenticated)
    ).subscribe());
  }

  ngOnChanges(): void {
    this.currentTheme = this.themingService.getCurrentTheme();
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  toggleTheme(): void {
    this.themingService.toggleTheme();
    this.currentTheme = this.themingService.getCurrentTheme();
  }

  onLogClick(): void {
    if (this.authenticated) {
      this.watcher.add(this.authService.logout().pipe(
        tap(() => this.router.navigateByUrl('auth').then())
      ).subscribe());
    } else {
      this.router.navigateByUrl('auth').then();
    }
  }
}
