import {Component, OnChanges} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {Theme, ThemingService} from "../../services/theming.service";

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
export class NavbarComponent implements OnChanges {

  protected currentTheme: Theme = Theme.DARK;

  protected readonly Theme = Theme;

  constructor(
    private readonly themingService: ThemingService
  ) {}

  ngOnChanges(): void {
    this.currentTheme = this.themingService.getCurrentTheme();
  }

  toggleTheme(): void {
    this.themingService.toggleTheme();
    this.currentTheme = this.themingService.getCurrentTheme();
  }
}
