import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { eventNames } from '../../../consts';

@Component({
  selector: 'tui-image-editor-menus-buttons-redo',
  templateUrl: './redo.component.html',
  styleUrls: ['./redo.component.css'],
})
export class RedoComponent implements OnChanges {
  @Input() imageEditor: any;
  @Output() cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();
  public redoStackSize: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor'] && changes['imageEditor'].currentValue != null) {
      this.imageEditor.on(
        eventNames.REDO_STACK_CHANGED,
        function (length: number) {
          that.redoStackSize = length;
        }
      );
    }
  }

  redo() {
    if (this.imageEditor!=null && !this.imageEditor.isEmptyRedoStack()) {
      this.cancelCroppingRequested.emit();
      this.imageEditor.deactivateAll();
      this.imageEditor.redo();
    }
  }
}
