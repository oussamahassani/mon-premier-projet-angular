import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterDemandintComponent } from './consulter-demandint.component';

describe('ConsulterDemandintComponent', () => {
  let component: ConsulterDemandintComponent;
  let fixture: ComponentFixture<ConsulterDemandintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterDemandintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterDemandintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
