import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeservicesComponent } from './listeservices.component';

describe('ListeservicesComponent', () => {
  let component: ListeservicesComponent;
  let fixture: ComponentFixture<ListeservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
