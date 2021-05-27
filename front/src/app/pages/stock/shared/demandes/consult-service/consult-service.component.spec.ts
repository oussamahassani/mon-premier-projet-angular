import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultServiceComponent } from './consult-service.component';

describe('ConsultServiceComponent', () => {
  let component: ConsultServiceComponent;
  let fixture: ComponentFixture<ConsultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
