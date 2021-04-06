import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.css'],
})
export class MaskComponent {
  @Input() imageChosen: boolean;
  @Input() selected: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}
}
