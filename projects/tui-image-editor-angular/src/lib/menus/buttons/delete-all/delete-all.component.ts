import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-delete-all',
  templateUrl: './delete-all.component.html',
  styleUrls: ['./delete-all.component.css'],
})
export class DeleteAllComponent {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;
  @Output()
  cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  deleteAll() {
    if (this.imageEditor != null && this.imageChosen) {
      this.cancelCroppingRequested.emit();
      this.imageEditor.clearObjects();
    }
  }
}
