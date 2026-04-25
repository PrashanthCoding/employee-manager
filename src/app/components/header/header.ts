import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="header">
      <div class="header-grid"></div>
      <div class="header-content">
        <div>
          <div class="header-title">Employee <span>Manager</span> Pro</div>
          <div class="header-sub">Manage your team efficiently and effectively</div>
        </div>
        <div class="header-actions">
          <button class="theme-btn" (click)="toggleTheme()">
            <i
              class="fas"
              [class.fa-moon]="theme() === 'dark'"
              [class.fa-sun]="theme() === 'light'"
            ></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./header.css'],
})
export class Header {
  theme = signal(localStorage.getItem('emp_theme') || 'dark');

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('emp_theme', newTheme);
  }

  private applyTheme(theme: string) {
    document.body.setAttribute('data-theme', theme);
  }
}
