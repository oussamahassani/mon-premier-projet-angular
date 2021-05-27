import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildemandeComponent } from './detaildemande.component';

describe('DetaildemandeComponent', () => {
  let component: DetaildemandeComponent;
  let fixture: ComponentFixture<DetaildemandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaildemandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaildemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
