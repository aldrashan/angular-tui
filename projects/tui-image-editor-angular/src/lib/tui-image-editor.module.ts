import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiImageEditorComponent } from './tui-image-editor.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { LoadComponent } from './menus/buttons/load/load.component';
import { HistoryComponent } from './menus/buttons/history/history.component';
import { SvgDefinitionsComponent } from './svg-definitions/svg-definitions.component';
import { DownloadComponent } from './menus/buttons/download/download.component';
import { ZoomInComponent } from './menus/buttons/zoom-in/zoom-in.component';
import { ZoomOutComponent } from './menus/buttons/zoom-out/zoom-out.component';
import { DragComponent } from './menus/buttons/drag/drag.component';
import { UndoComponent } from './menus/buttons/undo/undo.component';
import { RedoComponent } from './menus/buttons/redo/redo.component';
import { ResetComponent } from './menus/buttons/reset/reset.component';
import { DeleteComponent } from './menus/buttons/delete/delete.component';
import { DeleteAllComponent } from './menus/buttons/delete-all/delete-all.component';
import { CropComponent } from './menus/buttons/crop/crop.component';
import { CropComponent as SubmenusCropComponent } from './submenus/crop/crop.component';
import { FlipComponent } from './menus/buttons/flip/flip.component';
import { FlipComponent as SubmenusFlipComponent } from './submenus/flip/flip.component';
import { RotateComponent } from './menus/buttons/rotate/rotate.component';
import { RotateComponent as SubmenusRotateComponent } from './submenus/rotate/rotate.component';
import { DrawComponent } from './menus/buttons/draw/draw.component';
import { DrawComponent as SubmenusDrawComponent } from './submenus/draw/draw.component';
import { ShapeComponent } from './menus/buttons/shape/shape.component';
import { ShapeComponent as SubmenusShapeComponent } from './submenus/shape/shape.component';
import { IconComponent } from './menus/buttons/icon/icon.component';
import { IconComponent as SubmenusIconComponent } from './submenus/icon/icon.component';
import { TextComponent } from './menus/buttons/text/text.component';
import { TextComponent as SubmenusTextComponent } from './submenus/text/text.component';
import { MaskComponent } from './menus/buttons/mask/mask.component';
import { MaskComponent as SubmenusMaskComponent } from './submenus/mask/mask.component';
import { FilterComponent } from './menus/buttons/filter/filter.component';
import { FilterComponent as SubmenusFilterComponent } from './submenus/filter/filter.component';
import { TranslationService } from './i18n/translation.service';

export const translateModule = TranslateModule.forRoot();

@NgModule({
  declarations: [
    TuiImageEditorComponent,
    LoadComponent,
    HistoryComponent,
    SvgDefinitionsComponent,
    DownloadComponent,
    ZoomInComponent,
    ZoomOutComponent,
    DragComponent,
    UndoComponent,
    RedoComponent,
    ResetComponent,
    DeleteComponent,
    DeleteAllComponent,
    CropComponent,
    SubmenusCropComponent,
    FlipComponent,
    SubmenusFlipComponent,
    RotateComponent,
    SubmenusRotateComponent,
    DrawComponent,
    SubmenusDrawComponent,
    ShapeComponent,
    SubmenusShapeComponent,
    IconComponent,
    SubmenusIconComponent,
    TextComponent,
    SubmenusTextComponent,
    MaskComponent,
    SubmenusMaskComponent,
    FilterComponent,
    SubmenusFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    translateModule,
    ColorPickerModule,
    NgbPopoverModule,
  ],
  exports: [TuiImageEditorComponent, SvgDefinitionsComponent],
  providers: [TranslationService],
})
export class TuiImageEditorModule {
  static forRoot() {
    return {
      ngModule: TuiImageEditorModule,
      providers: [],
    };
  }
}
