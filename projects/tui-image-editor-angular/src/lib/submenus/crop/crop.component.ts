import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { cropModes, eventNames, historyNames } from '../../consts';
import { isEmptyCropzone } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css'],
})
export class CropComponent implements OnChanges {
  @Input() imageEditor: any;
  public activeCropMode: cropModes = cropModes.PRESET_NONE;
  public CROPMODE_PRESET_NONE: cropModes = cropModes.PRESET_NONE;
  public CROPMODE_PRESET_SQUARE: cropModes = cropModes.PRESET_SQUARE;
  public CROPMODE_PRESET_16_9: cropModes = cropModes.PRESET_16_9;
  public CROPMODE_PRESET_3_2: cropModes = cropModes.PRESET_3_2;
  public CROPMODE_PRESET_4_3: cropModes = cropModes.PRESET_4_3;
  public CROPMODE_PRESET_5_4: cropModes = cropModes.PRESET_5_4;
  public CROPMODE_PRESET_7_5: cropModes = cropModes.PRESET_7_5;
  @Output()
  cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageEditor'] && changes['imageEditor'].currentValue != null) {
      this.imageEditor.startDrawingMode('CROPPER');
    }
  }

  setCropMode(cropMode: cropModes) {
    this.activeCropMode = cropMode;
    switch (cropMode) {
      case cropModes.PRESET_SQUARE:
        this.setCropzoneRect(1 / 1);
        break;
      case cropModes.PRESET_3_2:
        this.setCropzoneRect(3 / 2);
        break;
      case cropModes.PRESET_4_3:
        this.setCropzoneRect(4 / 3);
        break;
      case cropModes.PRESET_5_4:
        this.setCropzoneRect(5 / 4);
        break;
      case cropModes.PRESET_7_5:
        this.setCropzoneRect(7 / 5);
        break;
      case cropModes.PRESET_16_9:
        this.setCropzoneRect(16 / 9);
        break;
    }
  }

  setCropzoneRect(mode: number) {
    this.imageEditor.setCropzoneRect(mode);
  }

  applyCrop() {
    if (this.imageEditor != null) {
      const cropRect = this.imageEditor.getCropzoneRect();
      if (cropRect && !isEmptyCropzone(cropRect)) {
        this.imageEditor
          .crop(cropRect)
          .then(() => {
            this.cancelCrop();
            this.imageEditor._invoker.fire(
              eventNames.EXECUTE_COMMAND,
              historyNames.CROP
            );
          })
          ['catch']((message) => Promise.reject(message));
      }
    }
  }

  cancelCrop() {
    this.cancelCroppingRequested.emit();
  }
}
