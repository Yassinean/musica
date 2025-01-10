import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    nav {
      animation: fadeIn 0.5s ease-out;
    }
  `],
})

export class NavbarComponent {
  navLinks = [
    { path: '/library', label: 'Library' },
    { path: '/tracks', label: 'Add tracks'  }
  ];
}
