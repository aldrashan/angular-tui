import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiImageEditorComponent } from './tui-image-editor.component';

describe('TuiImageEditorComponent', () => {
  let component: TuiImageEditorComponent;
  let fixture: ComponentFixture<TuiImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TuiImageEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TuiImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
