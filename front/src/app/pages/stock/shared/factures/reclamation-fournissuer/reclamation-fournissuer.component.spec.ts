import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationFournissuerComponent } from './reclamation-fournissuer.component';

describe('ReclamationFournissuerComponent', () => {
  let component: ReclamationFournissuerComponent;
  let fixture: ComponentFixture<ReclamationFournissuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclamationFournissuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamationFournissuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
