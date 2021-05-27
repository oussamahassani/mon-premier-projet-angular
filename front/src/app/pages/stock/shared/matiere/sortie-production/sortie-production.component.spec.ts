import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortieProductionComponent } from './sortie-production.component';

describe('SortieProductionComponent', () => {
  let component: SortieProductionComponent;
  let fixture: ComponentFixture<SortieProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortieProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortieProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
