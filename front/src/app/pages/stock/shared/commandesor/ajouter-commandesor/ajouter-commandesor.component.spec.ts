import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCommandesorComponent } from './ajouter-commandesor.component';

describe('AjouterCommandesorComponent', () => {
  let component: AjouterCommandesorComponent;
  let fixture: ComponentFixture<AjouterCommandesorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterCommandesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterCommandesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
