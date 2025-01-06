import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClassicComponent} from "./classic/classic.component";



@NgModule({
  declarations: [ClassicComponent],
  imports: [
    CommonModule
  ]
})
export class LegacyModule { }
