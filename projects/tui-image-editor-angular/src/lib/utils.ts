import { commandNames, eventNames, filterType, historyNames } from './consts';
import { Command } from './interfaces/command';

export function isFileApiSupported(): boolean {
  return !!(window.File && window.FileList && window.FileReader);
}

export function isSilentCommand(command: string | Command) {
  return typeof command === 'string'
    ? commandNames.LOAD_IMAGE === command
    : commandNames.LOAD_IMAGE === command.name;
}

export function getHistoryTitle(command): { name: string; detail: any } {
  const {
    FLIP_IMAGE,
    ROTATE_IMAGE,
    ADD_TEXT,
    APPLY_FILTER,
    REMOVE_FILTER,
    CHANGE_SHAPE,
    CHANGE_ICON_COLOR,
    CHANGE_TEXT_STYLE,
    CLEAR_OBJECTS,
    ADD_IMAGE_OBJECT,
    REMOVE_OBJECT,
  } = commandNames;
  const { name, args } = command;
  let historyInfo;

  switch (name) {
    case FLIP_IMAGE:
      historyInfo = {
        name,
        detail: args[1] === 'reset' ? args[1] : args[1].slice(4),
      };
      break;
    case ROTATE_IMAGE:
      historyInfo = { name, detail: args[2] };
      break;
    case APPLY_FILTER:
      historyInfo = {
        name: historyNames.APPLY_FILTER,
        detail: getFilterType(args[1], args[2]),
      };
      break;
    case REMOVE_FILTER:
      historyInfo = { name: historyNames.REMOVE_FILTER, detail: args[1] };
      break;
    case CHANGE_SHAPE:
      historyInfo = { name: historyNames.CHANGE_SHAPE, detail: 'Change' };
      break;
    case CHANGE_ICON_COLOR:
      historyInfo = { name: historyNames.CHANGE_ICON_COLOR, detail: 'Change' };
      break;
    case CHANGE_TEXT_STYLE:
      historyInfo = { name: historyNames.CHANGE_TEXT_STYLE, detail: 'Change' };
      break;
    case REMOVE_OBJECT:
      historyInfo = { name: historyNames.REMOVE_OBJECT, detail: args[2] };
      break;
    case CLEAR_OBJECTS:
      historyInfo = { name: historyNames.CLEAR_OBJECTS, detail: 'All' };
      break;
    case ADD_IMAGE_OBJECT:
      historyInfo = { name: historyNames.ADD_IMAGE_OBJECT, detail: 'Add' };
      break;
    case ADD_TEXT:
      historyInfo = { name: historyNames.ADD_TEXT };
      break;

    default:
      historyInfo = { name };
      break;
  }

  if (args[1] === 'mask') {
    historyInfo = { name: historyNames.LOAD_MASK_IMAGE, detail: 'Apply' };
  }

  return historyInfo;
}

export function getFilterType(
  type: string,
  { useAlpha = true, mode = null } = {}
): string {
  const {
    VINTAGE,
    REMOVE_COLOR,
    BLEND_COLOR,
    SEPIA2,
    COLOR_FILTER,
    REMOVE_WHITE,
    BLEND,
  } = filterType;

  let filterName;

  switch (type) {
    case VINTAGE:
      filterName = SEPIA2;
      break;
    case REMOVE_COLOR:
      filterName = useAlpha ? COLOR_FILTER : REMOVE_WHITE;
      break;
    case BLEND_COLOR:
      filterName = mode === 'add' ? BLEND : mode;
      break;
    default:
      filterName = type;
  }

  return toStartOfCapital(filterName);
}

function toStartOfCapital(str): string {
  return str.replace(/[a-z]/, (first) => first.toUpperCase());
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const {
    groups: { mime, base64data },
  } = /data:(?<mime>.+);base64,(?<base64data>.+)/.exec(dataUrl);

  const byteCharacters = atob(base64data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export const emptyCropRectValues = {
  LEFT: 0,
  TOP: 0,
  WIDTH: 0.5,
  HEIGHT: 0.5,
};

/**
 * Check if cropRect is Empty.
 * @param {Object} cropRect - cropRect object
 *  @param {Number} cropRect.left - cropRect left position value
 *  @param {Number} cropRect.top - cropRect top position value
 *  @param {Number} cropRect.width - cropRect width value
 *  @param {Number} cropRect.height - cropRect height value
 * @returns {boolean}
 */
export function isEmptyCropzone(cropRect) {
  const { left, top, width, height } = cropRect;
  const { LEFT, TOP, WIDTH, HEIGHT } = emptyCropRectValues;

  return left === LEFT && top === TOP && width === WIDTH && height === HEIGHT;
}

export function clearSelection(imageEditor: any, fire_event: boolean = true) {
  imageEditor.discardSelection();
  if (fire_event) {
    imageEditor.fire(eventNames.OBJECT_ACTIVATED, null);
    imageEditor.fire(eventNames.SELECTION_CLEARED, null);    
  }
}

export function getActiveObjectId(imageEditor: any): number | null {
  if (imageEditor != null) {
    let activeObject = imageEditor._graphics.getActiveObject();
    if (activeObject) {
      let activeObjectId = imageEditor._graphics.getObjectId(activeObject);
      return activeObjectId;
    }
  }
  return null;
}

export async function removeFilter(
  imageEditor: any,
  type: string,
  isSilent: boolean
) {
  if (imageEditor != null) {
    if (isSilent) {
      await imageEditor.executeSilent('removeFilter', type);
    } else {
      await imageEditor.execute('removeFilter', type);
    }
  }
}

export function rgbaToObject(
  rgba: string
): { r: number; g: number; b: number; hexString: string; alpha: number } {
  if (rgba.startsWith('rgba')) {
    const {
      groups: { r, g, b, a },
    } = /rgba\(\s*(?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\s*,\s*(?<a>[0-9.]+)\s*\)/.exec(
      rgba
    );

    let parsedR = parseInt(r);
    let parsedG = parseInt(g);
    let parsedB = parseInt(b);

    return {
      r: parsedR,
      g: parsedG,
      b: parsedB,
      hexString: `#${(parsedR <= 15 ? '0' : '') + parsedR.toString(16)}${
        (parsedG <= 15 ? '0' : '') + parsedG.toString(16)
      }${(parsedB <= 15 ? '0' : '') + parsedB.toString(16)}`,
      alpha: parseFloat(a),
    };
  }
  return rgbToObject(rgba);
}

export function rgbToObject(
  rgb: string
): { r: number; g: number; b: number; hexString: string; alpha: number } {
  if (rgb.startsWith('rgb')) {
    const {
      groups: { r, g, b },
    } = /rgb\(\s*(?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\s*\)/.exec(rgb);

    let parsedR = parseInt(r);
    let parsedG = parseInt(g);
    let parsedB = parseInt(b);

    return {
      r: parsedR,
      g: parsedG,
      b: parsedB,
      hexString: `#${(parsedR <= 15 ? '0' : '') + parsedR.toString(16)}${
        (parsedG <= 15 ? '0' : '') + parsedG.toString(16)
      }${(parsedB <= 15 ? '0' : '') + parsedB.toString(16)}`,
      alpha: 1,
    };
  }
  return null;
}
