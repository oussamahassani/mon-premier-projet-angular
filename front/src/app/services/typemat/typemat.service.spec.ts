import { TestBed } from '@angular/core/testing';

import { TypematService } from './typemat.service';

describe('TypematService', () => {
  let service: TypematService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypematService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
