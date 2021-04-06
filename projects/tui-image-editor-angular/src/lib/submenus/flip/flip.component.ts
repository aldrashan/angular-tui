import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tui-image-editor-submenus-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.css'],
})
export class FlipComponent {
  @Input() imageEditor: any;

  constructor() {}

  async flipX() {
    try {
      await this.imageEditor?.flipX();
    } catch (_err) {
      console.error(_err);
    }
  }

  async flipY() {
    try {
      await this.imageEditor?.flipY();
    } catch (_err) {
      console.error(_err);
    }
  }

  async resetFlip() {
    try {
      await this.imageEditor?.resetFlip();
    } catch (_err) {
      console.error(_err);
    }
  }
}
