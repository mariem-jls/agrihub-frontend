import { TestBed } from '@angular/core/testing';

import { FundingProjectsService } from './funding-projects.service';

describe('FundingProjectsService', () => {
  let service: FundingProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
