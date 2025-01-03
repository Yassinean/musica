import { TestBed } from '@angular/core/testing';

import { TrackStorageService } from './track-storage.service';

describe('TrackStorageService', () => {
  let service: TrackStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
