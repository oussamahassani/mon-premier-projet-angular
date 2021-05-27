import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirbonComponent } from './voirbon.component';

describe('VoirbonComponent', () => {
  let component: VoirbonComponent;
  let fixture: ComponentFixture<VoirbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
