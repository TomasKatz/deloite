import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit, OnChanges {

  constructor() { }
  @Input()msg: string;
  msgs = [];
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.msg){
      this.msgs.push(changes.msg.currentValue);
    }
  }
}
