import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css'],
})
export class CropComponent  {
  @Input() imageChosen: boolean;
  @Input() selected: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}
}
