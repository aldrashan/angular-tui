import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  cropModes,
  defaultIconPath,
  drawingModes,
  eventNames,
  historyNames,
  objectTypes,
  zoomModes,
} from './consts';
import { Command } from './interfaces/command';
import { HistoryItem, HistoryItemType } from './interfaces/history-item';
import { ImageSize } from './interfaces/image-size';
import { HistoryService } from './services/history.service';
import { FilterComponent } from './submenus/filter/filter.component';
import {
  clearSelection,
  dataUrlToBlob,
  isFileApiSupported,
  isSilentCommand,
} from './utils';
// const ImageEditor = require('tui-image-editor');
import ImageEditor from 'tui-image-editor';

@Component({
  selector: 'tui-image-editor',
  templateUrl: 'tui-image-editor.component.html',
  providers: [HistoryService],
})
export class TuiImageEditorComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('imageContainer') imageContainer: ElementRef;
  @Input() options: {
    usageStatistics: boolean;
    selectionStyle?: {
      cornerStyle: string;
      cornerSize: number;
      cornerColor: string;
      cornerStrokeColor: string;
      transparentCorners: boolean;
      lineWidth: number;
      borderColor: string;
      rotatingPointOffset: number;
    };
    applyCropSelectionStyle: boolean;
    applyGroupSelectionStyle: boolean;
  } = {
    usageStatistics: false,
    selectionStyle: {
      cornerStyle: 'circle',
      cornerSize: 32,
      cornerColor: '#fff',
      cornerStrokeColor: '#fff',
      transparentCorners: false,
      lineWidth: 4,
      borderColor: '#fff',
      rotatingPointOffset: 500,
    },
    applyCropSelectionStyle: true,
    applyGroupSelectionStyle: true,
  };
  @Input() initialImage: string | File;
  public imageEditor: any;
  public initializeImgUrl: string = null;
  public imageChosen: boolean = false;
  public activeObjectId: number;
  public submenu:
    | 'crop'
    | 'flip'
    | 'rotate'
    | 'filter'
    | 'text'
    | 'icon'
    | 'shape'
    | 'draw'
    | 'mask'
    | null;
  public rotation: number = 0;
  public onObjectActivatedEventListener: any;
  public onExecuteCommandEventListener: any;
  public onAfterUndoEventListener: any;
  public onAfterRedoEventListener: any;
  private historyServiceSubscription: Subscription;

  constructor(private historyService: HistoryService) {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
    this.onExecuteCommandEventListener = this.onExecuteCommand.bind(this);
    this.onAfterUndoEventListener = this.onAfterUndo.bind(this);
    this.onAfterRedoEventListener = this.onAfterRedo.bind(this);
  }

  ngOnInit(): void {
    this.historyServiceSubscription =
      this.historyService.onChangeEmitter.subscribe((items) =>
        this.onActiveHistoryElementChanged(items)
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['options'] && changes['options'].firstChange == false) ||
      (changes['initialImage'] && changes['initialImage'].firstChange == false)
    ) {
      this.destroyImageEditor();
      this.initializeImageEditor();
    }
  }

  initializeImageEditor() {
    this.historyService.clear();

    this.imageEditor = new ImageEditor(
      this.imageContainer.nativeElement,
      this.options
    );
    console.debug(this.imageEditor);

    this.imageEditor.registerIcons(defaultIconPath);

    this.imageEditor.on(
      eventNames.OBJECT_ACTIVATED,
      this.onObjectActivatedEventListener
    );
    this.imageEditor._invoker.on(
      eventNames.EXECUTE_COMMAND,
      this.onExecuteCommandEventListener
    );
    this.imageEditor._invoker.on(
      eventNames.AFTER_UNDO,
      this.onAfterUndoEventListener
    );
    this.imageEditor._invoker.on(
      eventNames.AFTER_REDO,
      this.onAfterRedoEventListener
    );

    if (this.initialImage != null) {
      this.loadImage(this.initialImage);
    }
  }

  destroyImageEditor() {
    if (this.imageEditor != null) {
      this.imageEditor.off(
        eventNames.OBJECT_ACTIVATED,
        this.onObjectActivatedEventListener
      );
      this.imageEditor._invoker.off(
        eventNames.EXECUTE_COMMAND,
        this.onExecuteCommandEventListener
      );
      this.imageEditor._invoker.off(
        eventNames.AFTER_UNDO,
        this.onAfterUndoEventListener
      );
      this.imageEditor._invoker.off(
        eventNames.AFTER_REDO,
        this.onAfterRedoEventListener
      );
      this.imageEditor.destroy();
    }
  }

  ngAfterViewInit(): void {
    var that = this;

    setTimeout(() => {
      //   this.imageEditor.on(eventNames.SELECTION_CLEARED, function () {
      //     that.activeObjectId = null;
      //     if (that.submenu === 'text') {
      //       that.imageEditor.changeCursor('text');
      //     } else if (that.submenu !== 'draw' && that.submenu !== 'crop') {
      //       that.imageEditor.stopDrawingMode();
      //     }
      //   });
      that.initializeImageEditor();
    });
  }

  ngOnDestroy(): void {
    if (this.initializeImgUrl != null) {
      URL.revokeObjectURL(this.initializeImgUrl);
    }
    this.destroyImageEditor();
    this.historyServiceSubscription?.unsubscribe();
  }

  private onObjectActivated(props) {
    console.debug(props);
    this.activeObjectId = props?.id;
    if (props?.id != null) {
      if (
        [
          objectTypes.shapeRect,
          objectTypes.shapeCircle,
          objectTypes.shapeTriangle,
        ].indexOf(props.type) > -1
      ) {
        this.showMenu('shape', false);
      } else if (
        props.type === objectTypes.line ||
        props.type === objectTypes.straightLine
      ) {
        this.showMenu('draw', false);
      } else if (
        props.type === objectTypes.itext ||
        props.type === objectTypes.text
      ) {
        this.showMenu('text', false);
      } else if (props.type === objectTypes.icon) {
        this.showMenu('icon', false);
      } else if (props.type === objectTypes.image) {
        this.showMenu('mask', false);
      }
    }
  }

  private onExecuteCommand(command: string | Command) {
    if (!isSilentCommand(command)) {
      this.historyService.add(command, this.imageEditor);
    }
  }

  private onAfterUndo() {
    this.historyService.prev();
  }

  private onAfterRedo() {
    this.historyService.next();
  }

  loadImage(file: string | File) {
    if (file != null) {
      let imageUrl: string = null;
      if (typeof file === 'string') {
        imageUrl = file;
      } else {
        if (!isFileApiSupported()) {
          alert('This browser does not support file-api');
          return;
        }

        imageUrl = URL.createObjectURL(file);
      }

      if (this.initializeImgUrl != null && imageUrl != this.initializeImgUrl) {
        URL.revokeObjectURL(this.initializeImgUrl);
      }

      this.initializeImgUrl = imageUrl;
      this.imageEditor
        .loadImageFromURL(this.initializeImgUrl, 'RandomFileName')
        .then((sizeValue: ImageSize) => {
          this.imageChosen = true;

          this.exitCropOnAction();
          this.imageEditor.clearUndoStack();
          this.imageEditor.clearRedoStack();
          this.historyService.clear();
          this.imageEditor._invoker.fire(
            eventNames.EXECUTE_COMMAND,
            historyNames.LOAD_IMAGE
          );
        })
        ['catch']((message) => Promise.reject(message));
    }
  }

  resetImage() {
    if (this.initializeImgUrl != null) {
      this.loadImage(this.initializeImgUrl);
    }
  }

  getImage(
    options: {
      format: 'jpeg' | 'png';
      quality: number;
      multiplier: number;
      left?: number;
      top?: number;
      width?: number;
      height?: number;
    } = {
      format: 'png',
      quality: 1,
      multiplier: 1,
    }
  ): string {
    if (this.imageChosen) {
      return this.imageEditor.toDataURL(options);
    }
    return null;
  }

  exitCropOnAction() {
    this.hideMenu('crop');
  }

  hideMenu(
    menuName:
      | 'crop'
      | 'flip'
      | 'rotate'
      | 'filter'
      | 'text'
      | 'icon'
      | 'shape'
      | 'draw'
      | 'mask'
      | null
  ) {
    if (this.submenu == menuName) {
      this.submenu = null;
      clearSelection(this.imageEditor);
      this.imageEditor.stopDrawingMode();
    }
  }

  onActiveHistoryElementChanged(items: HistoryItem[]) {
    let rotationEvents = items.filter((i) => i.type === HistoryItemType.Rotate);
    if (rotationEvents.length > 0) {
      let lastRotationEvent = rotationEvents[rotationEvents.length - 1];
      this.rotation = lastRotationEvent.args[0];
    } else {
      this.rotation = 0;
    }
  }

  showMenu(
    menuName:
      | 'crop'
      | 'flip'
      | 'rotate'
      | 'filter'
      | 'text'
      | 'icon'
      | 'shape'
      | 'draw'
      | 'mask'
      | null,
    discardSelection: boolean = true
  ) {
    this.submenu = menuName;
    if (discardSelection) {
      clearSelection(this.imageEditor);
    }
    this.imageEditor.stopDrawingMode();
    //this.stopShape();
    // this._changeMenu(menuName, toggle, discardSelection);

    // if (this.submenu == 'draw') {
    //   this.setDrawMode('free', {
    //     width: this.drawStrokeWidthValue,
    //     color: this.drawStrokeColor,
    //   });
    // }
  }
}
