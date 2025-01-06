import {Component, OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-cookbook';
  base: string = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css?v=${environment.version || 0}`;
  fontAwesomeUrl!: SafeResourceUrl;

  private readonly urlPattern = /^https:\/\/[\w.-]+\/.+$/;

  constructor(private sanitizer: DomSanitizer) {
    if (this.validateUrl(this.base)) {
      this.fontAwesomeUrl = this.sanitizeUrl(this.base);
    } else {
      this.fontAwesomeUrl = this.sanitizeUrl('');
    }

  }

  validateUrl(url: string): boolean {
    return this.urlPattern.test(url);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  set faUrl(value: string) {
    this.fontAwesomeUrl = this.sanitizeUrl(value);
  }

  get faUrl(): SafeResourceUrl {
    return this.fontAwesomeUrl;
  }

  get titleValue(): string{
    return this.title;
  }

  readonly environment = environment;
}
