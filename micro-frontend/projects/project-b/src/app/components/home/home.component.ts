import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <h2>Project B - Home</h2>
    <nav>
      <ul>
        <li><a routerLink="/">Go to root</a></li>
        <li><a routerLink="/project-b/feature">Go to Feature</a></li>
      </ul>
    </nav>
  `,
  imports: [
    RouterLink
  ]
})
export class HomeComponent {}
