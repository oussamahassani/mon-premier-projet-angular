import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterMatiereComponent } from './consulter-matiere.component';

describe('ConsulterMatiereComponent', () => {
  let component: ConsulterMatiereComponent;
  let fixture: ComponentFixture<ConsulterMatiereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulterMatiereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulterMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
