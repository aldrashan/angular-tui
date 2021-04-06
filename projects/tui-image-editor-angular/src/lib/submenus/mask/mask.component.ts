import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { eventNames, historyNames } from '../../consts';
import { getActiveObjectId, isFileApiSupported } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.css'],
})
export class MaskComponent implements OnChanges, OnDestroy {
  @Input() imageEditor: any;
  public activeObjectId: number;
  public onObjectActivatedEventListener: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor() {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor']) {
      this.activeObjectId = getActiveObjectId(
        changes['imageEditor'].currentValue
      );
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
  }

  onMaskChosen(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile != null) {
      if (!isFileApiSupported()) {
        alert('This browser does not support file-api');
      }

      let imgUrl = URL.createObjectURL(selectedFile);
      this.imageEditor
        .loadImageFromURL(this.imageEditor.toDataURL(), 'FilterImage')
        .then(() => {
          this.imageEditor.addImageObject(imgUrl).then(() => {
            URL.revokeObjectURL(selectedFile);
          });
          this.imageEditor._invoker.fire(
            eventNames.EXECUTE_COMMAND,
            historyNames.LOAD_MASK_IMAGE
          );
          if (this.fileInput != null) {
            this.fileInput.nativeElement.value = '';
          }
        });
    }
  }

  applyMask() {
    if (
      this.activeObjectId != null &&
      getActiveObjectId(this.imageEditor) == this.activeObjectId
    ) {
      var props = this.imageEditor.getObjectProperties(
        this.activeObjectId,
        'type'
      );
      if (props.type === 'image') {
        this.imageEditor.applyFilter('mask', {
          maskObjId: this.activeObjectId,
        });
      }
    }
  }
}
