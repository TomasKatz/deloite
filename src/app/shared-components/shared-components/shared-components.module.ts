import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoggerComponent} from "./logger/logger.component";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [LoggerComponent],
  imports: [
    CommonModule,
    MatListModule
  ],
  exports:[
    LoggerComponent
  ]
})
export class SharedComponentsModule { }
