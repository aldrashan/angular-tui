import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-zoom-out',
  templateUrl: './zoom-out.component.html',
  styleUrls: ['./zoom-out.component.css'],
})
export class ZoomOutComponent {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;

  constructor() {}

  zoomOut() {
    this.imageEditor?._graphics.zoomOut();
  }
}
