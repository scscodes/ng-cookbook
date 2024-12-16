import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-feature',
  template: `
    <h2>Project B - Feature</h2>
    <a routerLink="/project-b">Back to Home</a>
  `,
  imports: [
    RouterLink
  ]
})
export class FeatureComponent {}
