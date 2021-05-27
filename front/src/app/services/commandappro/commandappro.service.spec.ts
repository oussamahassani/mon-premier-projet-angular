import { TestBed } from '@angular/core/testing';

import { CommandapproService } from './commandappro.service';

describe('CommandapproService', () => {
  let service: CommandapproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandapproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
