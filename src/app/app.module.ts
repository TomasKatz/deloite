import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedFormsModule} from "./shared-forms/shared-forms.module";
import {HttpClientModule} from "@angular/common/http";
import {SharedComponentsModule} from "./shared-components/shared-components/shared-components.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
