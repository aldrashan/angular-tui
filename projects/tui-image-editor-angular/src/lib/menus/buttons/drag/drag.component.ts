import { Component, Input, OnInit } from '@angular/core';
import { drawingModes, zoomModes } from '../../../consts';

@Component({
  selector: 'tui-image-editor-menus-buttons-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css'],
})
export class DragComponent {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;

  constructor() {}

  get isSelected(): boolean {
    if (this.imageEditor == null) {
      return false;
    }
    const zoomMode = this.imageEditor?._graphics.getZoomMode();
    return (
      this.imageEditor.getDrawingMode() == drawingModes.ZOOM &&
      zoomMode === zoomModes.HAND
    );
  }

  startDrag() {
    this.imageEditor?.deactivateAll();
    this.toggleHandMode();
  }

  toggleHandMode() {
    const zoomMode = this.imageEditor?._graphics.getZoomMode();

    this.imageEditor?.stopDrawingMode();
    if (zoomMode !== zoomModes.HAND) {
      this.imageEditor?.startDrawingMode(drawingModes.ZOOM);
      this.imageEditor?._graphics.startHandMode();
    } else {
      this.imageEditor?._graphics.endHandMode();
    }
  }
}
