import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterInventaireComponent } from './consulter-inventaire.component';

describe('ConsulterInventaireComponent', () => {
  let component: ConsulterInventaireComponent;
  let fixture: ComponentFixture<ConsulterInventaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterInventaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
