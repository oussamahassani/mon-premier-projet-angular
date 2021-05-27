import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeprixComponent } from './demandeprix.component';

describe('DemandeprixComponent', () => {
  let component: DemandeprixComponent;
  let fixture: ComponentFixture<DemandeprixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeprixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeprixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
