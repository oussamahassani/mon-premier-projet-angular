import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirfactureComponent } from './voirfacture.component';

describe('VoirfactureComponent', () => {
  let component: VoirfactureComponent;
  let fixture: ComponentFixture<VoirfactureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirfactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirfactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
