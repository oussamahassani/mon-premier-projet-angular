import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirservicereceptionComponent } from './voirservicereception.component';

describe('VoirservicereceptionComponent', () => {
  let component: VoirservicereceptionComponent;
  let fixture: ComponentFixture<VoirservicereceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirservicereceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirservicereceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
