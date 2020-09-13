import { TestBed } from '@angular/core/testing';

import { PageElementsService } from './page-elements.service';

describe('PageElemntService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageElementsService = TestBed.get(PageElementsService);
    expect(service).toBeTruthy();
  });
});
