import { TestBed } from '@angular/core/testing';

import { TuiImageEditorService } from './tui-image-editor.service';

describe('TuiImageEditorService', () => {
  let service: TuiImageEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuiImageEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
