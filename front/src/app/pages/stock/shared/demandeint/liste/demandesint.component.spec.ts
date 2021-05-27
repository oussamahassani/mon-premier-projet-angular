import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesintComponent } from './demandesint.component';

describe('DemandesintComponent', () => {
  let component: DemandesintComponent;
  let fixture: ComponentFixture<DemandesintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandesintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
