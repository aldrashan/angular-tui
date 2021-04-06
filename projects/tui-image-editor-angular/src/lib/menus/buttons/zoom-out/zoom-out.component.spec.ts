import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomOutComponent } from './zoom-out.component';

describe('ZoomOutComponent', () => {
  let component: ZoomOutComponent;
  let fixture: ComponentFixture<ZoomOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
