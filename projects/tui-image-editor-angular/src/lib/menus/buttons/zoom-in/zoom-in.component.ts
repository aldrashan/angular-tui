import { Component, Input, OnInit } from '@angular/core';
import { drawingModes, zoomModes } from '../../../consts';

@Component({
  selector: 'tui-image-editor-menus-buttons-zoom-in',
  templateUrl: './zoom-in.component.html',
  styleUrls: ['./zoom-in.component.css'],
})
export class ZoomInComponent {
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
      zoomMode !== zoomModes.HAND
    );
  }

  startZoom() {
    this.imageEditor?.startDrawingMode(drawingModes.ZOOM);
    this.zoomIn();
  }

  private zoomIn() {
    this.imageEditor?.deactivateAll();
    this.toggleZoomMode();
  }

  private toggleZoomMode() {
    const zoomMode = this.imageEditor?._graphics.getZoomMode();

    this.imageEditor?.stopDrawingMode();
    if (zoomMode !== zoomModes.ZOOM) {
      this.imageEditor?.startDrawingMode(drawingModes.ZOOM);
      this.imageEditor?._graphics.startZoomInMode();
    } else {
      this.imageEditor?._graphics.endZoomInMode();
    }
  }
}
