import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDdosierFournissuerComponent } from './add-ddosier-fournissuer.component';

describe('AddDdosierFournissuerComponent', () => {
  let component: AddDdosierFournissuerComponent;
  let fixture: ComponentFixture<AddDdosierFournissuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDdosierFournissuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDdosierFournissuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
