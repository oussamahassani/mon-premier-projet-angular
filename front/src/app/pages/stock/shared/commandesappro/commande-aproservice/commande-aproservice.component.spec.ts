import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAproserviceComponent } from './commande-aproservice.component';

describe('CommandeAproserviceComponent', () => {
  let component: CommandeAproserviceComponent;
  let fixture: ComponentFixture<CommandeAproserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandeAproserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeAproserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
