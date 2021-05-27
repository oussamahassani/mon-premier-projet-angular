import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterTypematComponent } from './ajouter-typemat.component';

describe('AjouterTypematComponent', () => {
  let component: AjouterTypematComponent;
  let fixture: ComponentFixture<AjouterTypematComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterTypematComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterTypematComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
