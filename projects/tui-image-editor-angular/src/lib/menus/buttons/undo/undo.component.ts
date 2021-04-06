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
  selector: 'tui-image-editor-menus-buttons-undo',
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.css'],
})
export class UndoComponent implements OnChanges {
  @Input() imageEditor: any;
  @Output() cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();
  public undoStackSize: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor'] && changes['imageEditor'].currentValue != null) {
      this.imageEditor.on(
        eventNames.UNDO_STACK_CHANGED,
        function (length: number) {
          that.undoStackSize = length;
        }
      );
    }
  }

  undo() {
    if (this.imageEditor!=null && !this.imageEditor.isEmptyUndoStack()) {
      this.cancelCroppingRequested.emit();
      this.imageEditor.deactivateAll();
      this.imageEditor.undo();
    }
  }
}
