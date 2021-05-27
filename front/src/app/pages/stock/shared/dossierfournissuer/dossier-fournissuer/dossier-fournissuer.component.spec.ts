import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierFournissuerComponent } from './dossier-fournissuer.component';

describe('DossierFournissuerComponent', () => {
  let component: DossierFournissuerComponent;
  let fixture: ComponentFixture<DossierFournissuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DossierFournissuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierFournissuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
