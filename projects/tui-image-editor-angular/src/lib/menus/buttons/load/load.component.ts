import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-menus-buttons-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css'],
})
export class LoadComponent {
  @Output() loadImage: EventEmitter<File> = new EventEmitter<File>();

  constructor() {}

  onImageChosen(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile != null) {
      this.loadImage.emit(selectedFile);
    }
  }
}
