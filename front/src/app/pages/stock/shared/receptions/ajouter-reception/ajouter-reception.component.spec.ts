import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterReceptionComponent } from './ajouter-reception.component';

describe('AjouterReceptionComponent', () => {
  let component: AjouterReceptionComponent;
  let fixture: ComponentFixture<AjouterReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
