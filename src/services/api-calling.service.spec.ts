import { TestBed } from '@angular/core/testing';

import { ApiCallingService } from './api-calling.service';

describe('ApiCallingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCallingService = TestBed.get(ApiCallingService);
    expect(service).toBeTruthy();
  });
});
