import { commandNames, filterType, historyNames, objectTypes } from '../consts';
import { TranslationService } from '../i18n/translation.service';
import { getFilterType } from '../utils';
import { Command } from './command';

export enum HistoryItemType {
  Shape = 0,
  Icon = 1,
  Text = 2,
  Mask = 3,
  Crop = 4,
  Draw = 5,
  Rotate = 6,
  Flip = 7,
  Load = 8,
  Delete = 9,
  Image = 10,
  ApplyFilter = 11,
  RemoveFilter = 12,
}

export class HistoryItem {
  type: HistoryItemType;
  name: string;
  detail: string;
  args: any[];
  filterType?: filterType;

  constructor(
    command: string | Command,
    translationService: TranslationService,
    imageEditor: any
  ) {
    if (typeof command === 'string') {
      if (command === commandNames.TEXT) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-text-general'
        );
        this.detail = translationService.getTranslation(
          'tui-image-editor-angular-history-text-details'
        );
        this.type = HistoryItemType.Text;
      } else if (command === commandNames.MASK) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-mask-general'
        );
        this.detail = translationService.getTranslation(
          'tui-image-editor-angular-history-mask-details'
        );
        this.type = HistoryItemType.Mask;
      } else if (command === commandNames.CROP) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-crop'
        );
        this.type = HistoryItemType.Crop;
      } else if (command === commandNames.DRAW) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-draw-general'
        );
        this.detail = translationService.getTranslation(
          'tui-image-editor-angular-history-draw-details'
        );
        this.type = HistoryItemType.Draw;
      } else if (command === commandNames.ICON) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-icon-general'
        );
        this.detail = translationService.getTranslation(
          'tui-image-editor-angular-history-icon-details'
        );
        this.type = HistoryItemType.Icon;
      } else if (command === commandNames.LOAD) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-load'
        );
        this.type = HistoryItemType.Load;
      } else if (command === commandNames.SHAPE) {
        this.name = translationService.getTranslation(
          'tui-image-editor-angular-history-shape-general'
        );
        this.detail = translationService.getTranslation(
          'tui-image-editor-angular-history-shape-details'
        );
        this.type = HistoryItemType.Shape;
      } else {
        this.name = command;
      }
    } else {
      switch (command.name) {
        case commandNames.FLIP_IMAGE:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-flip'
          );
          switch (command.args[1]) {
            case 'reset':
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-flip-reset'
              );
              break;
            case 'flipX':
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-flip-flipX'
              );
              break;
            case 'flipY':
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-flip-flipY'
              );
              break;
          }
          this.type = HistoryItemType.Flip;
          break;
        case commandNames.ROTATE_IMAGE:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-rotate'
          );
          this.detail = command.args[2] + '°';
          this.type = HistoryItemType.Rotate;
          this.args = [command.args[2]];
          break;
        case commandNames.APPLY_FILTER:
          if (command.args?.length >= 3 && command.args[1] === 'mask') {
            this.name = translationService.getTranslation(
              'tui-image-editor-angular-history-mask-general'
            );
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-history-mask-apply'
            );
            this.type = HistoryItemType.Mask;
          } else {
            this.name = translationService.getTranslation(
              'tui-image-editor-angular-history-applyFilter'
            );
            this.detail = getFilterType(command.args[1], command.args[2]);
            this.type = HistoryItemType.ApplyFilter;
            if (
              command.args[1] === filterType.REMOVE_COLOR &&
              command.args[2] != null
            ) {
              this.filterType =
                command.args[2].useAlpha == null
                  ? filterType.REMOVE_COLOR
                  : filterType.REMOVE_WHITE;
              this.detail =
                command.args[2].useAlpha == null
                  ? translationService.getTranslation(
                      'tui-image-editor-angular-submenus-filter-colorFilter'
                    )
                  : translationService.getTranslation(
                      'tui-image-editor-angular-submenus-filter-removeWhite'
                    );
              this.args = [command.args[2].distance];
            } else if (
              command.args[1] === filterType.BLEND_COLOR &&
              command.args[2] != null
            ) {
              if (command.args[2].mode === 'tint') {
                this.filterType = filterType.TINT;
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-submenus-filter-tint'
                );
              } else if (command.args[2].mode === 'multiply') {
                this.filterType = filterType.MULTIPLY;
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-submenus-filter-multiply'
                );
              } else if (command.args[2].mode === 'add') {
                this.filterType = filterType.BLEND;
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-submenus-filter-blend'
                );
              }
              this.args = [command.args[2].color];
            } else if (
              command.args[1] === filterType.NOISE &&
              command.args[2] != null
            ) {
              this.filterType = filterType.NOISE;
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-noise'
              );
              this.args = [command.args[2].noise];
            } else if (
              command.args[1] === filterType.BRIGHTNESS &&
              command.args[2] != null
            ) {
              this.filterType = filterType.BRIGHTNESS;
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-brightness'
              );
              this.args = [command.args[2].brightness];
            } else if (
              command.args[1] === filterType.PIXELATE &&
              command.args[2] != null
            ) {
              this.filterType = filterType.PIXELATE;
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-pixelate'
              );
              this.args = [command.args[2].blocksize];
            } else if (command.args[1] === filterType.GRAYSCALE) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-grayscale'
              );
            } else if (command.args[1] === filterType.SEPIA) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-sepia'
              );
            } else if (command.args[1] === filterType.BLUR) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-blur'
              );
            } else if (command.args[1] === filterType.INVERT) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-invert'
              );
            } else if (command.args[1] === filterType.VINTAGE) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-sepia2'
              );
            } else if (command.args[1] === filterType.SHARPEN) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-sharpen'
              );
            } else if (command.args[1] === filterType.EMBOSS) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-submenus-filter-emboss'
              );
            }
          }
          break;
        case commandNames.REMOVE_FILTER:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-removeFilter'
          );
          if (command.args[1] === filterType.BLEND_COLOR) {
            this.filterType = filterType.BLEND_OR_TINT_OR_MULTIPLY;
            this.detail = `${translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-tint'
            )} | ${translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-multiply'
            )} | ${translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-blend'
            )}`;
          } else if (command.args[1] === filterType.REMOVE_COLOR) {
            this.filterType = filterType.REMOVE_COLOR_OR_WHITE;
            this.detail = `${translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-removeWhite'
            )} | ${translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-colorFilter'
            )}`;
          } else if (command.args[1] === filterType.GRAYSCALE) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-grayscale'
            );
          } else if (command.args[1] === filterType.SEPIA) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-sepia'
            );
          } else if (command.args[1] === filterType.BLUR) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-blur'
            );
          } else if (command.args[1] === filterType.INVERT) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-invert'
            );
          } else if (command.args[1] === filterType.VINTAGE) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-sepia2'
            );
          } else if (command.args[1] === filterType.SHARPEN) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-sharpen'
            );
          } else if (command.args[1] === filterType.EMBOSS) {
            this.detail = translationService.getTranslation(
              'tui-image-editor-angular-submenus-filter-emboss'
            );
          }
          this.type = HistoryItemType.RemoveFilter;
          break;
        case commandNames.CHANGE_SHAPE:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-shape-general'
          );
          if (command.args?.length >= 3) {
            let changedProperties = command.args[2];
            if (changedProperties.strokeWidth) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-shape-strokeWidth'
              );
            } else if (changedProperties.stroke) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-shape-stroke'
              );
            } else if (changedProperties.fill) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-shape-fill'
              );
            }
          }
          this.type = HistoryItemType.Shape;
          break;
        case commandNames.CHANGE_ICON_COLOR:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-icon-general'
          );
          this.detail = translationService.getTranslation(
            'tui-image-editor-angular-history-icon-colorChange'
          );
          this.type = HistoryItemType.Icon;
          break;
        case commandNames.CHANGE_TEXT_STYLE:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-text-general'
          );
          this.type = HistoryItemType.Text;
          if (
            command.args?.length >= 3 &&
            typeof command.args[2] === 'object'
          ) {
            let textStyleArg = command.args[2];
            if (textStyleArg.textAlign) {
              switch (textStyleArg.textAlign) {
                case 'left':
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-text-styleChange-textAlignment-left'
                  );
                  break;
                case 'center':
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-text-styleChange-textAlignment-center'
                  );
                  break;
                case 'right':
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-text-styleChange-textAlignment-right'
                  );
                  break;
              }
            } else if (
              textStyleArg.textDecoration ||
              textStyleArg.underline != null
            ) {
              if (textStyleArg.underline) {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-underline-true'
                );
              } else if (textStyleArg.underline === false) {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-underline-false'
                );
              }
            } else if (textStyleArg.fontStyle) {
              if (textStyleArg.fontStyle === 'normal') {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-fontStyle-normal'
                );
              } else if (textStyleArg.fontStyle === 'italic') {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-fontStyle-italic'
                );
              }
            } else if (textStyleArg.fontWeight) {
              if (textStyleArg.fontWeight === 'normal') {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-fontWeight-normal'
                );
              } else if (textStyleArg.fontWeight === 'bold') {
                this.detail = translationService.getTranslation(
                  'tui-image-editor-angular-history-text-styleChange-fontWeight-bold'
                );
              }
            } else if (textStyleArg.fontSize) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-text-styleChange-fontSize',
                { 0: textStyleArg.fontSize }
              );
            } else if (textStyleArg.fill) {
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-text-fill'
              );
            }
          }
          break;
        case commandNames.REMOVE_OBJECT:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-delete'
          );
          switch (command.args[2]) {
            case commandNames.DRAW:
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-delete-draw'
              );
              break;
            case commandNames.SHAPE:
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-delete-shape'
              );
              break;
            case commandNames.ICON:
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-delete-icon'
              );
              break;
            case commandNames.TEXT:
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-delete-text'
              );
              break;
            case commandNames.MASK:
              this.detail = translationService.getTranslation(
                'tui-image-editor-angular-history-delete-mask'
              );
              break;
          }
          this.type = HistoryItemType.Delete;
          break;
        case commandNames.CLEAR_OBJECTS:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-delete'
          );
          this.detail = translationService.getTranslation(
            'tui-image-editor-angular-history-delete-all'
          );
          this.type = HistoryItemType.Delete;
          break;
        case commandNames.ADD_IMAGE_OBJECT:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-mask-general'
          );
          this.detail = translationService.getTranslation(
            'tui-image-editor-angular-history-mask-added'
          );
          this.type = HistoryItemType.Image;
          break;
        case commandNames.ADD_TEXT:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-text-general'
          );
          this.detail = translationService.getTranslation(
            'tui-image-editor-angular-history-text-added'
          );
          this.type = HistoryItemType.Text;
          break;
        case commandNames.SET_OBJECT_PROPERTIES:
          if (command.args?.length >= 3) {
            let objectId = command.args[1];
            var props = imageEditor?.getObjectProperties(objectId, ['type']);
            console.debug(props);
            if (props?.type) {
              if (
                [objectTypes.line, objectTypes.straightLine].indexOf(
                  props.type
                ) > -1
              ) {
                this.name = translationService.getTranslation(
                  'tui-image-editor-angular-history-draw-general'
                );
                this.type = HistoryItemType.Draw;
                let changedProperties = command.args[2];
                if (changedProperties?.strokeWidth) {
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-draw-strokeWidth',
                    { 0: changedProperties.strokeWidth }
                  );
                } else if (changedProperties?.stroke) {
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-draw-stroke'
                  );
                }
              } else if (props.type === objectTypes.icon) {
                this.name = translationService.getTranslation(
                  'tui-image-editor-angular-history-icon-general'
                );
                this.type = HistoryItemType.Icon;
                let changedProperties = command.args[2];
                if (changedProperties?.fill) {
                  this.detail = translationService.getTranslation(
                    'tui-image-editor-angular-history-icon-fill'
                  );
                }
              }
            }
          }
          break;
        case commandNames.ADD_ICON:
          this.name = translationService.getTranslation(
            'tui-image-editor-angular-history-icon-general'
          );
          this.detail = translationService.getTranslation(
            'tui-image-editor-angular-history-icon-added'
          );
          this.type = HistoryItemType.Icon;
          break;
        default:
          this.name = command.name;
          break;
      }
    }
  }
}
