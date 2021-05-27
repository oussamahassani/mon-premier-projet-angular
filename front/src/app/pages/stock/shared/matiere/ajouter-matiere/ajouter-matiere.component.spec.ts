import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterMatiereComponent } from './ajouter-matiere.component';

describe('AjouterMatiereComponent', () => {
  let component: AjouterMatiereComponent;
  let fixture: ComponentFixture<AjouterMatiereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterMatiereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
