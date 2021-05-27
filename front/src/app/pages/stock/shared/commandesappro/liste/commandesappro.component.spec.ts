import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesapproComponent } from './commandesappro.component';

describe('CommandesapproComponent', () => {
  let component: CommandesapproComponent;
  let fixture: ComponentFixture<CommandesapproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandesapproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandesapproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
