import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    RouterLink,
    RouterLinkActive,
    MatAnchor,
    MatDivider,
    MatButton,
    NgOptimizedImage
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
}
