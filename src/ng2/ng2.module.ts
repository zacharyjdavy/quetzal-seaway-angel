import { NgModule } from '@angular/core';
import { Ng2Component } from './ng2.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule],
  declarations: [Ng2Component],
  exports: [Ng2Component],
  bootstrap: [Ng2Component],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Ng2Module {}
