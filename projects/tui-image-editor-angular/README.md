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
Place the following component somewhere on the page.  
It only needs to be defined once, for example inside your app.component.html file.

```html
<tui-image-editor-svg-definitions></tui-image-editor-svg-definitions>
```

You should then be able to use the image editor component inside any component.
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

## Dependencies
This library currently depends on the following libraries:
- [@ng-bootstrap/ng-bootstrap](https://ng-bootstrap.github.io/) for the [popover](https://ng-bootstrap.github.io/#/components/popover/examples) component.
- [ngx-color-picker](https://www.npmjs.com/package/ngx-color-picker) for choosing the colors of certain elements.
- [tui-image-editor](https://www.npmjs.com/package/tui-image-editor)

## Translations
Currently, I've only supplied English and Dutch translations.  
You can however supply your own translations, or override mine like so:

```js
import { TranslationService } from 'tui-image-editor-angular';
import { fr } from './i18n/fr';
import { de } from './i18n/de';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    private availableLanguages = { fr, de };

    constructor(private translateService: TranslationService) {
        Object.keys(this.availableLanguages).forEach((language) => {
            translateService.loadCustomMessages(language, this.availableLanguages[language]);
        });
    }

    ...
}
```

fr.ts file example:

```js
export const fr = {
  'tui-image-editor-angular-menus-buttons-crop-tooltip': 'Recadrer',
  'tui-image-editor-angular-menus-buttons-delete': 'Supprimer',
  'tui-image-editor-angular-menus-buttons-deleteAll': 'Tout supprimer'
  ...
}
```

Take a look at my [en.ts](src/lib/i18n/en.ts) file to see which strings you can/should use/override.