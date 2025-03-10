import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustLayout();
  }

  constructor(private themeService: ThemeService) {
    this.adjustLayout();
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isDarkTheme$.subscribe((isDark) => {
      document.body.style.backgroundColor = isDark
        ? 'var(--bg-primary)'
        : 'var(--bg-primary)';
      document.body.style.color = isDark
        ? 'var(--text-primary)'
        : 'var(--text-primary)';
    });
  }

  private adjustLayout() {
    const windowWidth = window.innerWidth;
  }
}
