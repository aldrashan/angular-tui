import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;
  @Output() cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetImage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}
  
  reset() {
    this.cancelCroppingRequested.emit();
    this.resetImage.emit();
  }
}
