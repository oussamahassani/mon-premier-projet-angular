import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirReceptionComponent } from './voir-reception.component';

describe('VoirReceptionComponent', () => {
  let component: VoirReceptionComponent;
  let fixture: ComponentFixture<VoirReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
