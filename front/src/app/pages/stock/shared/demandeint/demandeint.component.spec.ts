import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeintComponent } from './demandeint.component';

describe('DemandeintComponent', () => {
  let component: DemandeintComponent;
  let fixture: ComponentFixture<DemandeintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
