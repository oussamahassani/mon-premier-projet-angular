import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemandintComponent } from './add-demandint.component';

describe('AddDemandintComponent', () => {
  let component: AddDemandintComponent;
  let fixture: ComponentFixture<AddDemandintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDemandintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDemandintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
