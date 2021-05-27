import { TestBed } from '@angular/core/testing';

import { DemandeintService } from './demandeint.service';

describe('DemandeintService', () => {
  let service: DemandeintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
