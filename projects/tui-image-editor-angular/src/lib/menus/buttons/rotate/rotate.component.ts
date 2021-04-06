import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-rotate',
  templateUrl: './rotate.component.html',
  styleUrls: ['./rotate.component.css'],
})
export class RotateComponent {
  @Input() imageChosen: boolean;
  @Input() selected: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}
}
