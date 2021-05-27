import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeapproComponent } from './commandeappro.component';

describe('CommandeapproComponent', () => {
  let component: CommandeapproComponent;
  let fixture: ComponentFixture<CommandeapproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandeapproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeapproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
