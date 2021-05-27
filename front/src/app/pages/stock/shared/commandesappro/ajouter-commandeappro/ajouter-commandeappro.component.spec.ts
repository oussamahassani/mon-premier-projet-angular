import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCommandeapproComponent } from './ajouter-commandeappro.component';

describe('AjouterCommandeapproComponent', () => {
  let component: AjouterCommandeapproComponent;
  let fixture: ComponentFixture<AjouterCommandeapproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterCommandeapproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterCommandeapproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
