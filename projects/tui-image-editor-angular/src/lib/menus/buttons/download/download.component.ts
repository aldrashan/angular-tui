import { Component, Input, OnInit } from '@angular/core';
import { dataUrlToBlob } from '../../../utils';

@Component({
  selector: 'tui-image-editor-menus-buttons-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;

  constructor() {}

  downloadImage() {
    if (this.imageChosen && this.imageEditor != null) {
      const dataURL = this.imageEditor.toDataURL();
      if (window.fetch) {
        fetch(dataURL)
          .then((res) => res.blob())
          .then((blob) => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.target = '_blank';
            link.click();
          });
      } else {
        let blob = dataUrlToBlob(dataURL);
        var link = document.createElement('a');
        link.target = '_blank';
        link.href = window.URL.createObjectURL(blob);
        link.click();
      }
    }
  }
}
