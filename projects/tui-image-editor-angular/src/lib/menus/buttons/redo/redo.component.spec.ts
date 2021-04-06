import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedoComponent } from './redo.component';

describe('RedoComponent', () => {
  let component: RedoComponent;
  let fixture: ComponentFixture<RedoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
