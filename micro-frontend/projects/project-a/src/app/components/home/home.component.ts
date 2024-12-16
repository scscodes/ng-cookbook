import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <h2>Project A - Home</h2>
    <nav>
      <ul>
        <li><a routerLink="/">Go to root</a></li>
        <li><a routerLink="/project-a/feature">Go to Feature</a></li>
      </ul>
    </nav>
  `,
  imports: [
    RouterLink
  ]
})
export class HomeComponent {}
