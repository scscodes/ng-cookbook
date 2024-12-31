import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-cookbook';
  base = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css?v=${environment.version || 0}`;
  fontAwesomeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    if (this.validateUrl(this.base)) {
      this.fontAwesomeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base);
    } else {
      throw new Error('Invalid base URL');
    }
  }

  validateUrl(url: string): boolean {
    const urlPattern = /^https:\/\/cdnjs\.cloudflare\.com\/.+$/;
    return urlPattern.test(url);
  }

  get faUrl(): SafeResourceUrl {
    return this.fontAwesomeUrl;
  }

  set faUrl(value: string) {
    this.fontAwesomeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  protected readonly environment = environment;
}
