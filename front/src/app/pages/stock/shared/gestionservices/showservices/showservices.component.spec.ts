import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowservicesComponent } from './showservices.component';

describe('ShowservicesComponent', () => {
  let component: ShowservicesComponent;
  let fixture: ComponentFixture<ShowservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
