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
  selector: 'tui-image-editor-submenus-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css'],
})
export class ShapeComponent implements OnChanges, OnDestroy {
  @Input() imageEditor: any;
  @Input() defaultShapeStrokeColors: string[] = defaultColors;
  @Input() defaultShapeFillColors: string[] = defaultColors;
  public shapeStrokeWidthValue: number = 3;
  public shapeFillColor: string = 'rgba(255, 255, 255, 0)';
  public shapeStrokeColor: string = 'rgba(0, 169, 255, 1)';
  public shapeType: 'circle' | 'triangle' | 'rect';
  public activeObjectId: number;
  public onObjectActivatedEventListener: any;
  public onObjectAddedEventListener: any;

  constructor() {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
    this.onObjectAddedEventListener = this.onObjectAdded.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor']) {
      this.activeObjectId = getActiveObjectId(
        changes['imageEditor'].currentValue
      );
      this.checkActiveObject(this.activeObjectId);

      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );

      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ADDED,
        that.onObjectAddedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ADDED,
        that.onObjectAddedEventListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.imageEditor) {
      this.imageEditor.off(
        eventNames.OBJECT_ACTIVATED,
        this.onObjectActivatedEventListener
      );
      this.imageEditor.off(
        eventNames.OBJECT_ADDED,
        this.onObjectAddedEventListener
      );
    }
  }

  private onObjectActivated(props) {
    this.activeObjectId = props?.id;
    this.checkActiveObject(this.activeObjectId);
  }

  private onObjectAdded(props) {
    if (props && ['rect', 'circle', 'triangle'].indexOf(props.type) > -1) {
      this.shapeType = null;
      this.imageEditor?.stopDrawingMode();
    }
  }

  private checkActiveObject(activeObjectId: number) {
    if (activeObjectId != null) {
      var props = this.imageEditor?.getObjectProperties(activeObjectId, [
        'type',
        'strokeWidth',
        'stroke',
        'fill',
      ]);
      if (props && ['rect', 'circle', 'triangle'].indexOf(props.type) > -1) {
        this.shapeStrokeWidthValue = props.strokeWidth;
        this.shapeFillColor =
          typeof props.fill == 'object' && props.fill.type == 'color'
            ? props.fill.color
            : props.fill == null || props.fill.trim() == ''
            ? 'rgba(255, 255, 255, 0)'
            : props.fill;
        this.shapeStrokeColor =
          props.stroke == null || props.stroke.trim() == ''
            ? 'rgba(255, 255, 255, 0)'
            : props.stroke;
      }
    }
  }

  shapeStrokeWidthChanged(currentStrokeWidth: number | Event, isSilent: boolean) {
    this.setDrawingShape(this.shapeType, {
      fill: this.shapeFillColor,
      stroke: this.shapeStrokeColor,
      strokeWidth: typeof currentStrokeWidth === "number" ? currentStrokeWidth : this.shapeStrokeWidthValue,
    });
    this.shapeChangeActiveObject('strokeWidth', isSilent);
  }

  shapeColorChanged(type: 'stroke' | 'fill', currentColor: string) {
    switch (type) {
      case 'fill':
        this.setDrawingShape(this.shapeType, {
          fill: currentColor,
          stroke: this.shapeStrokeColor,
          strokeWidth: this.shapeStrokeWidthValue,
        });
        break;
      case 'stroke':
        this.setDrawingShape(this.shapeType, {
          fill: this.shapeFillColor,
          stroke: currentColor,
          strokeWidth: this.shapeStrokeWidthValue,
        });
        break;
    }
    this.shapeChangeActiveObject(
      type == 'stroke' ? 'strokeColor' : 'fillColor'
    );
  }

  setShapeType(type: 'circle' | 'triangle' | 'rect') {
    clearSelection(this.imageEditor);
    if (this.shapeType != type) {
      this.shapeType = type;
      this.imageEditor.startDrawingMode('SHAPE');
      this.setDrawingShape(this.shapeType, {
        fill: this.shapeFillColor,
        stroke: this.shapeStrokeColor,
        strokeWidth: this.shapeStrokeWidthValue,
      });
    } else {
      this.shapeType = null;
      this.imageEditor.stopDrawingMode();
    }
  }

  setDrawingShape(
    type: 'circle' | 'triangle' | 'rect',
    options: {
      fill: string;
      stroke: string;
      strokeWidth: number;
    }
  ) {
    this.imageEditor.setDrawingShape(type, options);
  }

  shapeChangeActiveObject(
    changedProperty: 'strokeWidth' | 'strokeColor' | 'fillColor',
    isSilent: boolean = false
  ) {
    if (
      this.activeObjectId != null &&
      getActiveObjectId(this.imageEditor) == this.activeObjectId
    ) {
      var props = this.imageEditor.getObjectProperties(
        this.activeObjectId,
        'type'
      );
      if (
        props != null &&
        ['rect', 'circle', 'triangle'].indexOf(props.type) > -1
      ) {
        let parameters = null;
        switch (changedProperty) {
          case 'strokeWidth':
            parameters = {
              strokeWidth: this.shapeStrokeWidthValue,
            };
            break;
          case 'strokeColor':
            parameters = {
              stroke: this.shapeStrokeColor,
            };
            break;
          case 'fillColor':
            parameters = {
              fill: this.shapeFillColor,
            };
            break;
        }
        let functionToExecute = () => {
          this.imageEditor.changeShape(
            this.activeObjectId,
            parameters,
            isSilent
          );
        };
        if (isSilent) {
          functionToExecute();
        } else {
          setTimeout(functionToExecute);
        }
      }
    }
  }
}
