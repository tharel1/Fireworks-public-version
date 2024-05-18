import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  private currentTheme: Theme = Theme.DARK;

  private static readonly LIGHT_THEME = 'light-theme';

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  toggleTheme(): void {
    switch (this.currentTheme) {
      case Theme.LIGHT:
        this.setDarkTheme();
        return;
      case Theme.DARK:
        this.setLightTheme();
        return;
    }
  }

  private setLightTheme(): void {
    document.body.classList.add(ThemingService.LIGHT_THEME);
    this.currentTheme = Theme.LIGHT;
  }

  private setDarkTheme(): void {
    document.body.classList.remove(ThemingService.LIGHT_THEME);
    this.currentTheme = Theme.DARK;
  }
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}
