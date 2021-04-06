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
  selector: 'tui-image-editor-menus-buttons-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent implements OnChanges {
  @Input() imageChosen: boolean;
  @Input() imageEditor: any;
  @Output()
  cancelCroppingRequested: EventEmitter<any> = new EventEmitter<any>();
  public activeObjectId: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor'] && changes['imageEditor'].currentValue != null) {
      this.imageEditor.on(eventNames.OBJECT_ACTIVATED, function (props) {
        that.activeObjectId = props?.id;
      });
    }
  }

  deleteActiveObject() {
    if (this.activeObjectId != null) {
      this.cancelCroppingRequested.emit();
      try {
        this.imageEditor.removeActiveObject();
      } catch (_err) {}
      this.activeObjectId = null;
    }
  }
}
