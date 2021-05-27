import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonlivComponent } from './bonliv.component';

describe('BonlivComponent', () => {
  let component: BonlivComponent;
  let fixture: ComponentFixture<BonlivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonlivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonlivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
