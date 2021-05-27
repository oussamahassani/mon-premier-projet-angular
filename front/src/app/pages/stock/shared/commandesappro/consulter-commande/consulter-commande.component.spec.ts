import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterCommandeComponent } from './consulter-commande.component';

describe('ConsulterCommandeComponent', () => {
  let component: ConsulterCommandeComponent;
  let fixture: ComponentFixture<ConsulterCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
