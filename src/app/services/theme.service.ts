import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setDarkTheme(savedTheme === 'dark');
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.setDarkTheme(prefersDark);
    }
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme.next(isDark);
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    this.setDarkTheme(!this.isDarkTheme.value);
  }
}
