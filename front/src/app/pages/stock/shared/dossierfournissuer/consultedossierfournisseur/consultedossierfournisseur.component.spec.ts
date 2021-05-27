import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultedossierfournisseurComponent } from './consultedossierfournisseur.component';

describe('ConsultedossierfournisseurComponent', () => {
  let component: ConsultedossierfournisseurComponent;
  let fixture: ComponentFixture<ConsultedossierfournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultedossierfournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultedossierfournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
