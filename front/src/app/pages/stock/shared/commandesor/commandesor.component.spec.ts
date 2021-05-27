import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesorComponent } from './commandesor.component';

describe('CommandesorComponent', () => {
  let component: CommandesorComponent;
  let fixture: ComponentFixture<CommandesorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
