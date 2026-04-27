import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: { currentUser: null } },
      ],
    });
    service = TestBed.inject(AuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
