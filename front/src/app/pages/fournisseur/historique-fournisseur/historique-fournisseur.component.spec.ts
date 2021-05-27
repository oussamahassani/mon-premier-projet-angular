import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueFournisseurComponent } from './historique-fournisseur.component';

describe('HistoriqueFournisseurComponent', () => {
  let component: HistoriqueFournisseurComponent;
  let fixture: ComponentFixture<HistoriqueFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
