import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterInventaireComponent } from './ajouter-inventaire.component';

describe('AjouterInventaireComponent', () => {
  let component: AjouterInventaireComponent;
  let fixture: ComponentFixture<AjouterInventaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterInventaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
