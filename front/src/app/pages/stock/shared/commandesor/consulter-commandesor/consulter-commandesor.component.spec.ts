import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterCommandesorComponent } from './consulter-commandesor.component';

describe('ConsulterCommandesorComponent', () => {
  let component: ConsulterCommandesorComponent;
  let fixture: ComponentFixture<ConsulterCommandesorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterCommandesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterCommandesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
