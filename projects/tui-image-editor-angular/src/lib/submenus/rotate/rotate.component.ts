import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tui-image-editor-submenus-rotate',
  templateUrl: './rotate.component.html',
  styleUrls: ['./rotate.component.css'],
})
export class RotateComponent {
  @Input() imageEditor: any;
  @Input() rotation: number;
  @Output() rotationChange = new EventEmitter<number>();

  constructor() {}

  async rotateImage(rotationAngle: number) {
    const newAngle = this.rotation + rotationAngle;
    const isRotatable = newAngle >= -360 && newAngle <= 360;
    if (isRotatable) {
      try {
        await this.imageEditor?.setAngle(newAngle);
        this.rotation = newAngle;
        this.rotationChange.emit(newAngle);
      } catch (_err) {
        console.error(_err);
      }
    }
  }

  async rotationChanged(
    currentRotationValue: number | Event,
    isSilent: boolean
  ) {
    let rotationValueToUse =
      typeof currentRotationValue === 'number'
        ? currentRotationValue
        : this.rotation;

    let functionToExecute = () => {
      this.imageEditor
        ?.setAngle(rotationValueToUse, isSilent)
        .catch((_err) => {
          console.error(_err);
        })
        .finally(() => {
          this.rotationChange.emit(rotationValueToUse);
        });
    };
    if (isSilent) {
      functionToExecute();
    } else {
      setTimeout(functionToExecute);
    }
  }
}
