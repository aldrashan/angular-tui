import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { defaultColors, eventNames } from '../../consts';
import { getActiveObjectId } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class TextComponent implements OnChanges, OnDestroy {
  @Input() imageEditor: any;
  public activeObjectId: number;
  @Input() defaultTextColors: string[] = defaultColors;
  public textColor: string = 'rgba(255, 187, 59, 1)';
  public textSizeValue: number = 50;
  public textAlign: 'left' | 'center' | 'right' = 'left';
  public textFontFamily = 'Noto Sans';
  public textFontStyle: 'normal' | 'italic' = 'normal';
  public textFontWeight: 'normal' | 'bold' = 'normal';
  public textDecoration:
    | 'underline'
    | 'line-through'
    | 'overline'
    | null = null;
  public onObjectActivatedEventListener: any;
  public onTextAddedEventListener: any;

  constructor() {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
    this.onTextAddedEventListener = this.onTextAdded.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor']) {
      this.activeObjectId = getActiveObjectId(
        changes['imageEditor'].currentValue
      );
      this.checkActiveObject(this.activeObjectId);
      changes['imageEditor'].currentValue?.startDrawingMode('TEXT');

      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );

      changes['imageEditor'].previousValue?.off(
        eventNames.ADD_TEXT,
        that.onTextAddedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.ADD_TEXT,
        that.onTextAddedEventListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.imageEditor) {
      this.imageEditor.off(
        eventNames.OBJECT_ACTIVATED,
        this.onObjectActivatedEventListener
      );
      this.imageEditor.off(eventNames.ADD_TEXT, this.onTextAddedEventListener);
    }
  }

  private onObjectActivated(props) {
    this.activeObjectId = props?.id;
    this.checkActiveObject(this.activeObjectId);
  }

  private onTextAdded(e) {
    this.imageEditor
      .addText('Edit text', {
        position: e.originPosition,
        styles: {
          fill: this.textColor,
          fontFamily: this.textFontFamily,
          fontSize: this.textSizeValue,
          fontStyle: this.textFontStyle,
          fontWeight: this.textFontWeight,
          textAlign: this.textAlign,
          textDecoration: this.textDecoration,
          underline: this.textDecoration == 'underline',
        },
      })
      .then(() => {
        this.imageEditor.changeCursor('default');
        this.imageEditor?.startDrawingMode('TEXT');
      });
  }

  private checkActiveObject(activeObjectId: number) {
    if (activeObjectId != null) {
      var props = this.imageEditor?.getObjectProperties(activeObjectId, [
        'type',
        'fill',
        'textAlign',
        'textDecoration',
        'fontFamily',
        'fontStyle',
        'fontWeight',
        'fontSize',
      ]);
      if (props && (props.type === 'i-text' || props.type === 'text')) {
        this.textAlign = props.textAlign;
        this.textColor = props.fill;
        this.textDecoration = props.textDecoration;
        this.textFontFamily = props.fontFamily;
        this.textFontStyle = props.fontStyle;
        this.textFontWeight = props.fontWeight;
        this.textSizeValue = props.fontSize;
        this.imageEditor?.startDrawingMode('TEXT');
      }
    }
  }

  changeTextAlignment(newValue: 'left' | 'center' | 'right') {
    this.textAlign = newValue;
    this.textChangeActiveObject('textAlign');
  }

  changeTextFontStyle(newFontStyle: 'normal' | 'italic') {
    this.textFontStyle = newFontStyle;
    this.textChangeActiveObject('fontStyle');
  }

  changeTextFontWeight(newFontWeight: 'normal' | 'bold') {
    this.textFontWeight = newFontWeight;
    this.textChangeActiveObject('fontWeight');
  }

  changeTextDecoration(
    newTextDecoration: 'underline' | 'line-through' | 'overline' | null
  ) {
    this.textDecoration = newTextDecoration;
    this.textChangeActiveObject('textDecoration');
  }

  textSizeValueChanged(currentTextSizeValue: number, isSilent: boolean) {
    this.textChangeActiveObject('fontSize', isSilent);
  }

  textColorChanged(currentColor: string) {
    this.textChangeActiveObject('color');
  }

  textChangeActiveObject(
    type:
      | 'color'
      | 'fontFamily'
      | 'fontSize'
      | 'fontStyle'
      | 'fontWeight'
      | 'textAlign'
      | 'textDecoration',
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
      let parameters = null;
      if (props.type === 'i-text' || props.type === 'text') {
        switch (type) {
          case 'color':
            parameters = {
              fill: this.textColor,
            };
            break;
          case 'fontFamily':
            parameters = {
              fontFamily: this.textFontFamily,
            };
            break;
          case 'fontSize':
            parameters = {
              fontSize: this.textSizeValue,
            };
            break;
          case 'fontStyle':
            parameters = {
              fontStyle: this.textFontStyle,
            };
            break;
          case 'fontWeight':
            parameters = {
              fontWeight: this.textFontWeight,
            };
            break;
          case 'textAlign':
            parameters = {
              textAlign: this.textAlign,
            };
            break;
          case 'textDecoration':
            parameters = {
              textDecoration: this.textDecoration,
            };
            break;
        }
        let functionToExecute = () => {
          this.imageEditor.changeTextStyle(
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
