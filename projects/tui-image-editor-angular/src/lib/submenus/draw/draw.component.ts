import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { defaultColors, eventNames } from '../../consts';
import { clearSelection, getActiveObjectId } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
})
export class DrawComponent implements OnChanges, OnDestroy {
  @Input() imageEditor: any;
  @Input() defaultDrawShapeColors: string[] = defaultColors;
  public drawStrokeWidthValue: number = 12;
  public drawType: 'free' | 'line';
  public drawStrokeColor: string = 'rgba(0, 169, 255, 1)';
  public activeObjectId: number;
  public onObjectActivatedEventListener: any;

  constructor() {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor']) {
      this.activeObjectId = getActiveObjectId(
        changes['imageEditor'].currentValue
      );
      this.checkActiveObject(this.activeObjectId, true);
      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.imageEditor) {
      this.imageEditor.off(
        eventNames.OBJECT_ACTIVATED,
        this.onObjectActivatedEventListener
      );
    }
  }

  private onObjectActivated(props) {
    this.activeObjectId = props?.id;
    this.checkActiveObject(this.activeObjectId);
  }

  private checkActiveObject(
    activeObjectId: number,
    enableDrawModeIfNoActiveObject: boolean = false
  ) {
    let ifNoActiveObject = () => {
      this.setDrawMode('free', {
        width: this.drawStrokeWidthValue,
        color: this.drawStrokeColor,
      });
    };
    if (activeObjectId != null) {
      var props = this.imageEditor?.getObjectProperties(activeObjectId, [
        'type',
        'strokeWidth',
        'stroke',
      ]);
      if (props && (props.type === 'path' || props.type === 'line')) {
        this.drawStrokeWidthValue = props.strokeWidth;
        this.drawStrokeColor = props.stroke;
      } else if (enableDrawModeIfNoActiveObject) {
        ifNoActiveObject();
      }
    } else if (enableDrawModeIfNoActiveObject) {
      ifNoActiveObject();
    }
  }

  drawStrokeWidthChanged(currentStrokeWidth: number | Event, isSilent: boolean) {
    this.setDrawMode(this.drawType, {
      width: typeof currentStrokeWidth === "number" ? currentStrokeWidth : this.drawStrokeWidthValue,
      color: this.drawStrokeColor,
    });
    this.strokeChangeActiveObject('strokeWidth', isSilent);
  }

  setDrawType(type: 'free' | 'line') {
    clearSelection(this.imageEditor);
    if (this.drawType != type) {
      this.drawType = type;
      this.setDrawMode(this.drawType, {
        width: this.drawStrokeWidthValue,
        color: this.drawStrokeColor,
      });
    } else {
      this.drawType = null;
      this.imageEditor.stopDrawingMode();
    }
  }

  drawStrokeColorChanged(currentStrokeColor: string) {
    this.setDrawMode(this.drawType, {
      width: this.drawStrokeWidthValue,
      color: currentStrokeColor,
    });
    this.strokeChangeActiveObject('strokeColor', false);
  }

  setDrawMode(
    type: 'free' | 'line' | null,
    settings: {
      width: number;
      color: string;
      arrowType?: {
        tail: 'chevron' | 'triangle';
        head: 'chevron' | 'triangle';
      };
    }
  ) {
    this.drawType = type;
    this.imageEditor.stopDrawingMode();
    if (type === 'free') {
      clearSelection(this.imageEditor);
      this.imageEditor.startDrawingMode('FREE_DRAWING', settings);
    } else if (type === 'line') {
      clearSelection(this.imageEditor);
      this.imageEditor.startDrawingMode('LINE_DRAWING', settings);
    }
  }

  strokeChangeActiveObject(
    changedProperty: 'strokeWidth' | 'strokeColor',
    isSilent: boolean
  ) {
    if (
      this.activeObjectId != null &&
      getActiveObjectId(this.imageEditor) == this.activeObjectId
    ) {
      var props = this.imageEditor.getObjectProperties(
        this.activeObjectId,
        'type'
      );
      if (props != null && (props.type === 'path' || props.type === 'line')) {
        let parameters = null;
        switch (changedProperty) {
          case 'strokeWidth':
            parameters = {
              strokeWidth: this.drawStrokeWidthValue,
            };
            break;
          case 'strokeColor':
            parameters = {
              stroke: this.drawStrokeColor,
            };
            break;
        }
        if (isSilent) {
          this.imageEditor.setObjectPropertiesQuietly(
            this.activeObjectId,
            parameters
          );
        } else {
          setTimeout(() => {
            this.imageEditor.setObjectProperties(
              this.activeObjectId,
              parameters
            );
          });
        }
      }
    }
  }
}
