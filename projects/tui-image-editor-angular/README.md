# Angular-Tui

Based on the UI component of [tui.image-editor](https://github.com/nhn/tui.image-editor).

## 💾 Install
```sh
npm install --save tui-image-editor-angular
```

Add needed package to NgModule imports:
```sh
import { TuiImageEditorModule } from 'tui-image-editor-angular';

@NgModule({
  ...
  imports: [TuiImageEditorModule,...]
  ...
})
```

Import css:
```scss
@import "tui-image-editor-angular/src/theme.scss";

...
```

## 📊 Usage
```html
<tui-image-editor></tui-image-editor>
```

```js
@Component({
  selector: 'tui-image-editor'
})
export class TuiImageEditorComponent{
  @Input() options: {
    usageStatistics: boolean;
    selectionStyle?: {
      cornerStyle: string;
      cornerSize: number;
      cornerColor: string;
      cornerStrokeColor: string;
      transparentCorners: boolean;
      lineWidth: number;
      borderColor: string;
      rotatingPointOffset: number;
    };
    applyCropSelectionStyle: boolean;
    applyGroupSelectionStyle: boolean;
  } = {
    usageStatistics: false,
    selectionStyle: {
      cornerStyle: 'circle',
      cornerSize: 32,
      cornerColor: '#fff',
      cornerStrokeColor: '#fff',
      transparentCorners: false,
      lineWidth: 4,
      borderColor: '#fff',
      rotatingPointOffset: 500
    },
    applyCropSelectionStyle: true,
    applyGroupSelectionStyle: true,
  };
  @Input() initialImage: string | File;

  ...
  }
```