import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { eventNames } from '../../../consts';
import { HistoryItem } from '../../../interfaces/history-item';
import { HistoryService } from '../../../services/history.service';
import { getHistoryTitle, isSilentCommand } from '../../../utils';

@Component({
  selector: 'tui-image-editor-menus-buttons-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  @Input() imageEditor: any;

  constructor(private historyService: HistoryService) {}

  get items(): HistoryItem[] {
    return this.historyService.items;
  }

  get historyIndex(): number {
    return this.historyService.historyIndex;
  }

  public onclickHistoryItem(index: number) {
    if (index !== this.historyIndex) {
      const count = Math.abs(index - this.historyIndex);

      if (index < this.historyIndex) {
        this.imageEditor?.undo(count).then(() => {
          this.historyService.onChangeEmitter.next(this.items.slice(0, index + 1));
        });
      } else {
        this.imageEditor?.redo(count).then(() => {
          this.historyService.onChangeEmitter.next(this.items.slice(0, index + 1));
        });
      }
    }
  }
}
