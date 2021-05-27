import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbonServiceComponent } from './addbon-service.component';

describe('AddbonServiceComponent', () => {
  let component: AddbonServiceComponent;
  let fixture: ComponentFixture<AddbonServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbonServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbonServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
