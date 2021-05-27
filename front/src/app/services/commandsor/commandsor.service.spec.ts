import { TestBed } from '@angular/core/testing';

import { CommandsorService } from './commandsor.service';

describe('CommandapproService', () => {
  let service: CommandsorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandsorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
