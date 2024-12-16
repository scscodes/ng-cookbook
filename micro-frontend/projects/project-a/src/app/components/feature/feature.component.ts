import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-feature',
  template: `
    <h2>Project A - Feature</h2>
    <a routerLink="/project-a">Back to Home</a>
  `,
  imports: [
    RouterLink
  ]
})
export class FeatureComponent {}
