import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import ImageTracer from 'tui-image-editor/src/js/helper/imagetracer';
import { defaultColors, eventNames } from '../../consts';
import { clearSelection, getActiveObjectId } from '../../utils';

@Component({
  selector: 'tui-image-editor-submenus-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
})
export class IconComponent implements OnChanges, OnDestroy {
  @Input() imageEditor: any;
  @Input() defaultIconColors: string[] = defaultColors;
  public iconColor: string = 'rgba(255, 187, 59, 1)';
  public iconType:
    | 'icon-arrow'
    | 'icon-arrow-2'
    | 'icon-arrow-3'
    | 'icon-star'
    | 'icon-star-2'
    | 'icon-polygon'
    | 'icon-location'
    | 'icon-heart'
    | 'icon-bubble';
  public activeObjectId: number;
  public onObjectActivatedEventListener: any;
  public onObjectAddedEventListener: any;

  constructor() {
    this.onObjectActivatedEventListener = this.onObjectActivated.bind(this);
    this.onObjectAddedEventListener = this.onObjectAdded.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var that = this;
    if (changes['imageEditor']) {
      this.activeObjectId = getActiveObjectId(changes['imageEditor'].currentValue);
      this.checkActiveObject(this.activeObjectId);

      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ACTIVATED,
        that.onObjectActivatedEventListener
      );

      changes['imageEditor'].previousValue?.off(
        eventNames.OBJECT_ADDED,
        that.onObjectAddedEventListener
      );
      changes['imageEditor'].currentValue?.on(
        eventNames.OBJECT_ADDED,
        that.onObjectAddedEventListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.imageEditor) {
      this.imageEditor.off(
        eventNames.OBJECT_ACTIVATED,
        this.onObjectActivatedEventListener
      );
      this.imageEditor.off(
        eventNames.OBJECT_ADDED,
        this.onObjectAddedEventListener
      );
    }
  }

  private onObjectActivated(props) {
    this.activeObjectId = props?.id;
    this.checkActiveObject(this.activeObjectId);
  }

  private onObjectAdded(props) {
    if (props && props.type === 'icon') {
      this.setActiveIconType(this.iconType, false);
    }
  }

  private checkActiveObject(activeObjectId: number) {
    if (activeObjectId != null) {
      var props = this.imageEditor?.getObjectProperties(activeObjectId, [
        'type',
        'fill',
      ]);
      if (props && props.type === 'icon') {
        this.iconColor =
          typeof props.fill == 'object' && props.fill.type == 'color'
            ? props.fill.color
            : props.fill == null || props.fill.trim() == ''
            ? 'rgba(255, 187, 59, 1)'
            : props.fill;
      }
    }
  }

  setActiveIconType(
    newIconType:
      | 'icon-arrow'
      | 'icon-arrow-2'
      | 'icon-arrow-3'
      | 'icon-star'
      | 'icon-star-2'
      | 'icon-polygon'
      | 'icon-location'
      | 'icon-heart'
      | 'icon-bubble',
    discardSelection: boolean = true
  ) {
    if (discardSelection) {
      clearSelection(this.imageEditor);
    }
    if (this.iconType != newIconType) {
      this.iconType = newIconType;
      this.imageEditor.startDrawingMode('ICON');
      this.imageEditor.setDrawingIcon(newIconType, this.iconColor);
      this.imageEditor.changeCursor('crosshair');
    } else {
      this.iconType = null;
      this.imageEditor.stopDrawingMode();
      this.imageEditor.changeCursor('default');
    }
  }

  iconColorChanged(currentColor: string) {
    this.iconChangeActiveObject();
  }

  iconChangeActiveObject() {
    if (
      this.activeObjectId != null &&
      getActiveObjectId(this.imageEditor) == this.activeObjectId
    ) {
      var props = this.imageEditor.getObjectProperties(
        this.activeObjectId,
        'type'
      );
      if (props.type === 'icon') {
        this.imageEditor.setObjectProperties(this.activeObjectId, {
          fill: this.iconColor,
        });
      }
    }
  }

  registerIcon(obj) {
    this.imageEditor.registerIcons(obj);
  }

  onIconChosen(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile != null) {
      var imgUrl = URL.createObjectURL(selectedFile);
      const imagetracer = new ImageTracer();
      imagetracer.imageToSVG(
        imgUrl,
        (svgstr) => {
          const [, svgPath] = svgstr.match(/path[^>]*d="([^"]*)"/);
          const iconObj = {};
          iconObj[selectedFile.name] = svgPath;
          this.registerIcon(iconObj);
          this.imageEditor.addIcon(selectedFile.name, {
            fill: this.iconColor,
            left: 100,
            top: 100,
          });
        },
        ImageTracer.tracerDefaultOption()
      );
    }
  }
}
