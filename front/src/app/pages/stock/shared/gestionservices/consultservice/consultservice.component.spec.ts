import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultserviceComponent } from './consultservice.component';

describe('ConsultserviceComponent', () => {
  let component: ConsultserviceComponent;
  let fixture: ComponentFixture<ConsultserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
