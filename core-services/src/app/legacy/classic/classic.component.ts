import { Component } from '@angular/core';

@Component({
  selector: 'app-classic',
  template: `
    <p>
      classic works!
    </p>
  `,
  styles: ``,
  standalone: false
})
export class ClassicComponent {

  isDisabled: boolean = true;
  isChecked: boolean = false;

  get disabled(): boolean {
    return this.isDisabled;
  }

  set disabled(value: boolean) {
    this.isDisabled = value;
  }

  get checked(): boolean {
    return this.isChecked;
  }

  set checked(value: boolean) {
    this.isChecked = value;
  }

  get basicTitle(): string {
    return 'value';
  }
}
