export enum zoomModes {
  DEFAULT = 'normal',
  ZOOM = 'zoom',
  HAND = 'hand',
}

export enum eventNames {
  OBJECT_ACTIVATED = 'objectActivated',
  OBJECT_MOVED = 'objectMoved',
  OBJECT_SCALED = 'objectScaled',
  OBJECT_CREATED = 'objectCreated',
  OBJECT_ROTATED = 'objectRotated',
  OBJECT_ADDED = 'objectAdded',
  OBJECT_MODIFIED = 'objectModified',
  TEXT_EDITING = 'textEditing',
  TEXT_CHANGED = 'textChanged',
  ICON_CREATE_RESIZE = 'iconCreateResize',
  ICON_CREATE_END = 'iconCreateEnd',
  ADD_TEXT = 'addText',
  ADD_OBJECT = 'addObject',
  ADD_OBJECT_AFTER = 'addObjectAfter',
  MOUSE_DOWN = 'mousedown',
  MOUSE_UP = 'mouseup',
  MOUSE_MOVE = 'mousemove',
  // UNDO/REDO Events
  REDO_STACK_CHANGED = 'redoStackChanged',
  UNDO_STACK_CHANGED = 'undoStackChanged',
  SELECTION_CLEARED = 'selectionCleared',
  SELECTION_CREATED = 'selectionCreated',
  EXECUTE_COMMAND = 'executeCommand',
  AFTER_UNDO = 'afterUndo',
  AFTER_REDO = 'afterRedo',
  ZOOM_CHANGED = 'zoomChanged',
  HAND_STARTED = 'handStarted',
  HAND_STOPPED = 'handStopped',
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
}

export enum commandNames {
  TEXT = 'Text',
  MASK = 'Image',
  CROP = 'Crop',
  DRAW = 'Draw',
  ICON = 'Icon',
  LOAD = 'Load',
  SHAPE = 'Shape',
  CLEAR_OBJECTS = 'clearObjects',
  LOAD_IMAGE = 'loadImage',
  FLIP_IMAGE = 'flip',
  ROTATE_IMAGE = 'rotate',
  ADD_OBJECT = 'addObject',
  REMOVE_OBJECT = 'removeObject',
  APPLY_FILTER = 'applyFilter',
  REMOVE_FILTER = 'removeFilter',
  ADD_ICON = 'addIcon',
  CHANGE_ICON_COLOR = 'changeIconColor',
  ADD_SHAPE = 'addShape',
  CHANGE_SHAPE = 'changeShape',
  ADD_TEXT = 'addText',
  CHANGE_TEXT = 'changeText',
  CHANGE_TEXT_STYLE = 'changeTextStyle',
  ADD_IMAGE_OBJECT = 'addImageObject',
  RESIZE_CANVAS_DIMENSION = 'resizeCanvasDimension',
  SET_OBJECT_PROPERTIES = 'setObjectProperties',
  SET_OBJECT_POSITION = 'setObjectPosition',
  CHANGE_SELECTION = 'changeSelection',
}

export enum historyNames {
  LOAD_IMAGE = 'Load',
  LOAD_MASK_IMAGE = 'Mask',
  ADD_MASK_IMAGE = 'Mask',
  ADD_IMAGE_OBJECT = 'Mask',
  CROP = 'Crop',
  APPLY_FILTER = 'Apply filter',
  REMOVE_FILTER = 'Remove filter',
  CHANGE_SHAPE = 'Shape',
  CHANGE_ICON_COLOR = 'Icon',
  ADD_TEXT = 'Text',
  CHANGE_TEXT_STYLE = 'Text',
  REMOVE_OBJECT = 'Delete',
  CLEAR_OBJECTS = 'Delete',
}

export enum filterType {
  VINTAGE = 'vintage',
  SEPIA2 = 'sepia2',
  REMOVE_COLOR = 'removeColor',
  COLOR_FILTER = 'colorFilter',
  REMOVE_WHITE = 'removeWhite',
  BLEND_COLOR = 'blendColor',
  BLEND = 'blend',
  TINT = 'tint',
  MULTIPLY = 'multiply',
  BLEND_OR_TINT_OR_MULTIPLY = 'blend_tint_multiply',
  REMOVE_COLOR_OR_WHITE = 'removeColor_removeWhite',
  BRIGHTNESS = 'brightness',
  NOISE = 'noise',
  PIXELATE = 'pixelate',
  SHARPEN = 'sharpen',
  INVERT = 'invert',
  EMBOSS = 'emboss',
  SEPIA = 'sepia',
  GRAYSCALE = 'grayscale',
  BLUR = 'blur',
}

export enum drawingModes {
  NORMAL = 'NORMAL',
  CROPPER = 'CROPPER',
  FREE_DRAWING = 'FREE_DRAWING',
  LINE_DRAWING = 'LINE_DRAWING',
  TEXT = 'TEXT',
  SHAPE = 'SHAPE',
  ICON = 'ICON',
  ZOOM = 'ZOOM',
}

export const defaultIconPath = {
  'icon-arrow': 'M40 12V0l24 24-24 24V36H0V12h40z',
  'icon-arrow-2':
    'M49,32 H3 V22 h46 l-18,-18 h12 l23,23 L43,50 h-12 l18,-18  z ',
  'icon-arrow-3':
    'M43.349998,27 L17.354,53 H1.949999 l25.996,-26 L1.949999,1 h15.404 L43.349998,27  z ',
  'icon-star':
    'M35,54.557999 l-19.912001,10.468 l3.804,-22.172001 l-16.108,-15.7 l22.26,-3.236 L35,3.746 l9.956,20.172001 l22.26,3.236 l-16.108,15.7 l3.804,22.172001  z ',
  'icon-star-2':
    'M17,31.212 l-7.194,4.08 l-4.728,-6.83 l-8.234,0.524 l-1.328,-8.226 l-7.644,-3.14 l2.338,-7.992 l-5.54,-6.18 l5.54,-6.176 l-2.338,-7.994 l7.644,-3.138 l1.328,-8.226 l8.234,0.522 l4.728,-6.83 L17,-24.312 l7.194,-4.08 l4.728,6.83 l8.234,-0.522 l1.328,8.226 l7.644,3.14 l-2.338,7.992 l5.54,6.178 l-5.54,6.178 l2.338,7.992 l-7.644,3.14 l-1.328,8.226 l-8.234,-0.524 l-4.728,6.83  z ',
  'icon-polygon': 'M3,31 L19,3 h32 l16,28 l-16,28 H19  z ',
  'icon-location':
    'M24 62C8 45.503 0 32.837 0 24 0 10.745 10.745 0 24 0s24 10.745 24 24c0 8.837-8 21.503-24 38zm0-28c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z',
  'icon-heart':
    'M49.994999,91.349998 l-6.96,-6.333 C18.324001,62.606995 2.01,47.829002 2.01,29.690998 C2.01,14.912998 13.619999,3.299999 28.401001,3.299999 c8.349,0 16.362,5.859 21.594,12 c5.229,-6.141 13.242001,-12 21.591,-12 c14.778,0 26.390999,11.61 26.390999,26.390999 c0,18.138 -16.314001,32.916 -41.025002,55.374001 l-6.96,6.285  z ',
  'icon-bubble':
    'M44 48L34 58V48H12C5.373 48 0 42.627 0 36V12C0 5.373 5.373 0 12 0h40c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12h-8z',
};

export enum cropModes {
  PRESET_SQUARE = 'preset-square',
  PRESET_3_2 = 'preset-3-2',
  PRESET_4_3 = 'preset-4-3',
  PRESET_5_4 = 'preset-5-4',
  PRESET_7_5 = 'preset-7-5',
  PRESET_16_9 = 'preset-16-9',
  PRESET_NONE = 'preset-none',
}

export const defaultColors: string[] = [
  '#000000',
  '#2a2a2a',
  '#545454',
  '#7e7e7e',
  '#a8a8a8',
  '#d2d2d2',
  '#ffffff',
  '#ff4040',
  '#ff6518',
  '#ffbb3b',
  '#03bd9e',
  '#00a9ff',
  '#515ce6',
  '#9e5fff',
  '#ff5583',
];

export enum objectTypes {
  icon = 'icon',
  image = 'image',
  itext = 'i-text',
  text = 'text',
  straightLine = 'line',
  line = 'path',
  shapeRect = 'rect',
  shapeCircle = 'circle',
  shapeTriangle = 'triangle',
}
