import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandessorComponent } from './commandessor.component';

describe('CommandesapproComponent', () => {
  let component: CommandessorComponent;
  let fixture: ComponentFixture<CommandessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
