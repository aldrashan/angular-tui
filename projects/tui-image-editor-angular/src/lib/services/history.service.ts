import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { historyNames } from '../consts';
import { TranslationService } from '../i18n/translation.service';
import { Command } from '../interfaces/command';
import { HistoryItem } from '../interfaces/history-item';
import { getHistoryTitle } from '../utils';

@Injectable()
export class HistoryService {
  public items: HistoryItem[] = [];
  public historyIndex: number = -1;
  public onChangeEmitter: BehaviorSubject<HistoryItem[]> = new BehaviorSubject(
    []
  );

  constructor(private translationService: TranslationService) {}

  /**
   * Get list's length
   */
  private get listLength(): number {
    return this.items.length;
  }

  /**
   * Clear history
   */
  clear() {
    if (this.listLength > 0) {
      this.deleteListItemElement(0, this.listLength);
      this.historyIndex = -1;
    }
  }

  /**
   * Whether history menu has disabled item
   */
  private hasDisabledItem(): boolean {
    return this.listLength - 1 > this.historyIndex;
  }

  /**
   * Push list item element
   */
  private pushListItemElement(item: HistoryItem) {
    this.items.push(item);
  }

  public add(command: string | Command, imageEditor: any) {
    console.debug(command);

    if (typeof command === 'string' && command === historyNames.LOAD_IMAGE) {
      this.deleteListItemElement(0, this.listLength);
    }

    if (this.hasDisabledItem()) {
      this.deleteListItemElement(this.historyIndex + 1, this.listLength);
    }

    if (
      typeof command === 'string' &&
      command === historyNames.ADD_MASK_IMAGE
    ) {
      imageEditor?.clearRedoStack();
      imageEditor?.clearUndoStack();
      this.deleteListItemElement(0, this.listLength);
    } else {
      this.pushListItemElement(
        new HistoryItem(command, this.translationService, imageEditor)
      );
      this.historyIndex = this.listLength - 1;
    }
  }

  /**
   * Select previous history of current selected history
   */
  prev() {
    this.historyIndex -= 1;
  }

  /**
   * Select next history of current selected history
   */
  next() {
    this.historyIndex += 1;
  }

  /**
   * Delete list item element
   * @param {number} start - start index to delete
   * @param {number} end - end index to delete
   */
  private deleteListItemElement(start: number, end: number) {
    this.items.splice(start, end - start + 1);
  }
}
