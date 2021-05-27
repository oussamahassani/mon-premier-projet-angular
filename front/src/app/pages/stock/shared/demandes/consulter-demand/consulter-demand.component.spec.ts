import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterDemandComponent } from './consulter-demand.component';

describe('ConsulterDemandComponent', () => {
  let component: ConsulterDemandComponent;
  let fixture: ComponentFixture<ConsulterDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
