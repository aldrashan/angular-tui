import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  @Input() imageChosen: boolean;
  @Input() selected: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}
}
