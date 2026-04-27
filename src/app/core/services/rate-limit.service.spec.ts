import { TestBed } from '@angular/core/testing';

import { RateLimit } from './rate-limit.service';

describe('RateLimit', () => {
  let service: RateLimit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateLimit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
