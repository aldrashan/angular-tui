import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { defaultColors, filterType, historyNames } from '../../consts';
import { HistoryItem, HistoryItemType } from '../../interfaces/history-item';
import { HistoryService } from '../../services/history.service';
import { removeFilter, rgbaToObject } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() imageEditor: any;
  public activeObjectId: number;

  public filterBlurChecked: boolean = false;
  public filterBlurValue: number = 0.1;

  public filterGrayscaleChecked: boolean = false;
  public filterSepiaChecked: boolean = false;
  public filterEmbossChecked: boolean = false;
  public filterInvertChecked: boolean = false;
  public filterVintageChecked: boolean = false;
  public filterSharpenChecked: boolean = false;

  public filterWhiteRemovalChecked: boolean = false;
  public filterWhiteRemovalDistance: number = 0.5;

  public filterBrightnessChecked: boolean = false;
  public filterBrightnessValue: number = 0;

  public filterNoiseChecked: boolean = false;
  public filterNoiseValue: number = 100;

  public filterPixelateChecked: boolean = false;
  public filterPixelateValue: number = 15;

  public filterColorFilterChecked: boolean = false;
  public filterColorFilterThreshold: number = 0;

  public defaultFilterTintColors: string[] = defaultColors;
  public filterTintChecked: boolean = false;
  public filterTintColor: string = 'rgba(3, 189, 158, 0.7)';

  public defaultFilterMultiplyColors: string[] = defaultColors;
  public filterMultiplyChecked: boolean = false;
  public filterMultiplyColor: string = 'rgb(81, 92, 230)';

  public defaultFilterBlendColors: string[] = defaultColors;
  public filterBlendChecked: boolean = false;
  public filterBlendColor: string = 'rgba(255, 187, 59, 1)';

  private historyServiceSubscription: Subscription;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyServiceSubscription = this.historyService.onChangeEmitter.subscribe(
      (items) =>
        items != null && items.length != 0
          ? this.rebindFields(items)
          : this.rebindFields(this.historyService.items)
    );
  }

  ngOnDestroy(): void {
    this.historyServiceSubscription?.unsubscribe();
  }

  public rebindFields(items: HistoryItem[]) {
    console.debug(items);
    if (this.imageEditor != null) {
      this.filterBlurChecked = this.imageEditor.hasFilter('blur');
      this.filterBrightnessChecked = this.imageEditor.hasFilter('brightness');
      if (this.filterBrightnessChecked) {
        this.filterBrightnessValue = this.getAppliedFilterArgument(
          items,
          filterType.BRIGHTNESS,
          0
        );
      }
      this.filterColorFilterChecked =
        this.imageEditor.hasFilter('removeColor') &&
        this.hasAppliedFilter(items, filterType.REMOVE_COLOR);
      if (this.filterColorFilterChecked) {
        this.filterColorFilterThreshold = this.getAppliedFilterArgument(
          items,
          filterType.REMOVE_COLOR,
          0
        );
      }
      this.filterEmbossChecked = this.imageEditor.hasFilter('emboss');
      this.filterGrayscaleChecked = this.imageEditor.hasFilter('grayscale');
      this.filterInvertChecked = this.imageEditor.hasFilter('invert');
      this.filterNoiseChecked = this.imageEditor.hasFilter('noise');
      if (this.filterNoiseChecked) {
        this.filterNoiseValue = this.getAppliedFilterArgument(
          items,
          filterType.NOISE,
          0
        );
      }
      this.filterPixelateChecked = this.imageEditor.hasFilter('pixelate');
      if (this.filterPixelateChecked) {
        this.filterPixelateValue = this.getAppliedFilterArgument(
          items,
          filterType.PIXELATE,
          0
        );
      }
      this.filterSepiaChecked = this.imageEditor.hasFilter('sepia');
      this.filterSharpenChecked = this.imageEditor.hasFilter('sharpen');
      this.filterVintageChecked = this.imageEditor.hasFilter('vintage');
      this.filterWhiteRemovalChecked =
        this.imageEditor.hasFilter('removeColor') &&
        this.hasAppliedFilter(items, filterType.REMOVE_WHITE);
      if (this.filterWhiteRemovalChecked) {
        this.filterWhiteRemovalDistance = this.getAppliedFilterArgument(
          items,
          filterType.REMOVE_WHITE,
          0
        );
      }

      this.filterMultiplyChecked =
        this.imageEditor.hasFilter('blendColor') &&
        this.hasAppliedFilter(items, filterType.MULTIPLY);
      if (this.filterMultiplyChecked) {
        this.filterMultiplyColor = this.getAppliedFilterArgument(
          items,
          filterType.MULTIPLY,
          0
        );
      }
      this.filterTintChecked =
        this.imageEditor.hasFilter('blendColor') &&
        this.hasAppliedFilter(items, filterType.TINT);
      if (this.filterTintChecked) {
        this.filterTintColor = this.getAppliedFilterArgument(
          items,
          filterType.TINT,
          0
        );
      }
      this.filterBlendChecked =
        this.imageEditor.hasFilter('blendColor') &&
        this.hasAppliedFilter(items, filterType.BLEND);
      if (this.filterBlendChecked) {
        this.filterBlendColor = this.getAppliedFilterArgument(
          items,
          filterType.BLEND,
          0
        );
      }
    }
  }

  private getAppliedFilterArgument(
    items: HistoryItem[],
    type: filterType,
    index: number
  ): any {
    let validItems = items.filter(
      (f) => f.filterType === type && f.type === HistoryItemType.ApplyFilter
    );
    return validItems[validItems.length - 1].args[index];
  }

  private hasAppliedFilter(
    historyItems: HistoryItem[],
    type: filterType
  ): boolean {
    let hasFilter = false;
    for (let i = 0; i < historyItems.length; i++) {
      let item = historyItems[i];
      if (
        item.type === HistoryItemType.ApplyFilter &&
        item.filterType === type
      ) {
        hasFilter = true;
      } else if (
        hasFilter == true &&
        [filterType.TINT, filterType.BLEND, filterType.MULTIPLY].some(
          (t) => t === type
        ) &&
        item.type === HistoryItemType.RemoveFilter &&
        item.filterType === filterType.BLEND_OR_TINT_OR_MULTIPLY
      ) {
        hasFilter = false;
      } else if (
        hasFilter == true &&
        [filterType.REMOVE_COLOR, filterType.REMOVE_WHITE].some(
          (t) => t === type
        ) &&
        item.type === HistoryItemType.RemoveFilter &&
        item.filterType === filterType.REMOVE_COLOR_OR_WHITE
      ) {
        hasFilter = false;
      }
    }
    return hasFilter;
  }

  filterWhiteRemovalCheckedChanged(newValue: boolean) {
    this.filterApply('white-removal');
  }

  filterWhiteRemovalDistanceChanged(newValue: number, isSilent: boolean) {
    this.filterApply('white-removal', isSilent);
  }

  filterBrightnessCheckedChanged(newValue: boolean) {
    this.filterApply('brightness');
  }

  filterBrightnessValueChanged(newValue: number, isSilent: boolean) {
    this.filterApply('brightness', isSilent);
  }

  filterNoiseCheckedChanged(newValue: boolean) {
    this.filterApply('noise');
  }

  filterNoiseValueChanged(newValue: number, isSilent: boolean) {
    this.filterApply('noise', isSilent);
  }

  filterPixelateCheckedChanged(newValue: boolean) {
    this.filterApply('pixelate');
  }

  filterPixelateValueChanged(newValue: number, isSilent: boolean) {
    this.filterApply('pixelate', isSilent);
  }

  filterColorFilterCheckedChanged(newValue: boolean) {
    this.filterApply('removeColor');
  }

  filterColorFilterThresholdChanged(newValue: number, isSilent: boolean) {
    this.filterApply('removeColor', isSilent);
  }

  filterTintColorChanged(newColor: string) {
    this.filterApply('tint');
  }

  filterTintCheckedChanged(newValue: boolean) {
    this.filterApply('tint');
    if (this.filterTintChecked) {
      this.filterMultiplyChecked = false;
      this.filterBlendChecked = false;
    }
  }

  filterMultiplyColorChanged(newColor: string) {
    this.filterApply('multiply');
  }

  filterMultiplyCheckedChanged(newValue: boolean) {
    this.filterApply('multiply');
    if (this.filterMultiplyChecked) {
      this.filterTintChecked = false;
      this.filterBlendChecked = false;
    }
  }

  filterBlendColorChanged(newColor: string) {
    this.filterApply('blend');
  }

  filterBlendCheckedChanged(newValue: boolean) {
    this.filterApply('blend');
    if (this.filterBlendChecked) {
      this.filterMultiplyChecked = false;
      this.filterTintChecked = false;
    }
  }

  filterBlurCheckedChanged(newValue: boolean) {
    this.filterApply('blur');
  }

  filterGrayscaleCheckedChanged(newValue: boolean) {
    this.filterApply('grayscale');
  }

  filterSepiaCheckedChanged(newValue: boolean) {
    this.filterApply('sepia');
  }

  filterEmbossCheckedChanged(newValue: boolean) {
    this.filterApply('emboss');
  }

  filterInvertCheckedChanged(newValue: boolean) {
    this.filterApply('invert');
  }

  filterVintageCheckedChanged(newValue: boolean) {
    this.filterApply('vintage');
  }

  filterSharpenCheckedChanged(newValue: boolean) {
    this.filterApply('sharpen');
  }

  filterApply(
    type:
      | 'white-removal'
      | 'brightness'
      | 'noise'
      | 'pixelate'
      | 'removeColor'
      | 'blur'
      | 'blend'
      | 'multiply'
      | 'tint'
      | 'grayscale'
      | 'sepia'
      | 'emboss'
      | 'invert'
      | 'vintage'
      | 'sharpen',
    isSilent: boolean = false
  ) {
    switch (type) {
      case 'white-removal':
        this.filterApplyConfirmed(
          this.filterWhiteRemovalChecked,
          'removeColor',
          {
            color: '#FFFFFF',
            useAlpha: false,
            distance: this.filterWhiteRemovalDistance,
          },
          isSilent
        );
        break;
      case 'brightness':
        this.filterApplyConfirmed(
          this.filterBrightnessChecked,
          'brightness',
          {
            brightness: this.filterBrightnessValue,
          },
          isSilent
        );
        break;
      case 'noise':
        this.filterApplyConfirmed(
          this.filterNoiseChecked,
          'noise',
          {
            noise: this.filterNoiseValue,
          },
          isSilent
        );
        break;
      case 'pixelate':
        this.filterApplyConfirmed(
          this.filterPixelateChecked,
          'pixelate',
          {
            blocksize: this.filterPixelateValue,
          },
          isSilent
        );
        break;
      case 'removeColor':
        this.filterApplyConfirmed(
          this.filterColorFilterChecked,
          'removeColor',
          {
            color: '#FFFFFF',
            distance: this.filterColorFilterThreshold,
          },
          isSilent
        );
        break;
      case 'blur':
        this.filterApplyConfirmed(
          this.filterBlurChecked,
          'blur',
          {
            blur: this.filterBlurValue,
          },
          isSilent
        );
        break;
      case 'blend':
        this.filterApplyConfirmed(
          this.filterBlendChecked,
          'blendColor',
          {
            mode: 'add',
            color: this.filterBlendColor,
          },
          isSilent
        );
        break;
      case 'multiply':
        this.filterApplyConfirmed(
          this.filterMultiplyChecked,
          'blendColor',
          {
            mode: 'multiply',
            color: this.filterMultiplyColor,
          },
          isSilent
        );
        break;
      case 'tint':
        let rgbTint = rgbaToObject(this.filterTintColor);

        this.filterApplyConfirmed(
          this.filterTintChecked,
          'blendColor',
          {
            mode: 'tint',
            color: rgbTint.hexString,
            alpha: rgbTint.alpha,
          },
          isSilent
        );
        break;
      case 'grayscale':
        this.filterApplyConfirmed(
          this.filterGrayscaleChecked,
          type,
          {},
          isSilent
        );
        break;
      case 'sepia':
        this.filterApplyConfirmed(this.filterSepiaChecked, type, {}, isSilent);
        break;
      case 'emboss':
        this.filterApplyConfirmed(this.filterEmbossChecked, type, {}, isSilent);
        break;
      case 'invert':
        this.filterApplyConfirmed(this.filterInvertChecked, type, {}, isSilent);
        break;
      case 'vintage':
        this.filterApplyConfirmed(
          this.filterVintageChecked,
          type,
          {},
          isSilent
        );
        break;
      case 'sharpen':
        this.filterApplyConfirmed(
          this.filterSharpenChecked,
          type,
          {},
          isSilent
        );
        break;
    }
  }

  async filterApplyConfirmed(
    applying: boolean,
    type:
      | 'removeColor'
      | 'brightness'
      | 'noise'
      | 'pixelate'
      | 'blur'
      | 'blendColor'
      | 'grayscale'
      | 'sepia'
      | 'emboss'
      | 'invert'
      | 'vintage'
      | 'sharpen',
    options: any,
    isSilent: boolean = false
  ) {
    let functionToExecute = async () => {
      if (applying) {
        if (type === 'blendColor' && this.imageEditor.hasFilter('blendColor')) {
          switch (options.mode) {
            case 'add':
              this.filterTintChecked = false;
              this.filterMultiplyChecked = false;
              break;
            case 'multiply':
              this.filterTintChecked = false;
              this.filterBlendChecked = false;
              break;
            case 'tint':
              this.filterBlendChecked = false;
              this.filterMultiplyChecked = false;
              break;
          }
          await removeFilter(this.imageEditor, type, isSilent);
        } else if (
          type === 'removeColor' &&
          this.imageEditor.hasFilter('removeColor')
        ) {
          if (options.useAlpha != null) {
            this.filterColorFilterChecked = false;
          } else {
            this.filterWhiteRemovalChecked = false;
          }
          await removeFilter(this.imageEditor, type, isSilent);
        }
        await this.imageEditor.applyFilter(type, options, isSilent);
      } else if (this.imageEditor.hasFilter(type)) {
        await removeFilter(this.imageEditor, type, isSilent);
        if (type == 'blendColor') {
          this.filterTintChecked = false;
          this.filterMultiplyChecked = false;
          this.filterBlendChecked = false;
        }
      }
    };
    if (isSilent) {
      await functionToExecute();
    } else {
      setTimeout(async () => {
        await functionToExecute();
      });
    }
  }
}
