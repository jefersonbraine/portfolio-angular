import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { AuditService } from '../../../../core/services/audit.service';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';

import { AdminGithub } from './admin-github';

describe('AdminGithub', () => {
  let component: AdminGithub;
  let fixture: ComponentFixture<AdminGithub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGithub],
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: AuditService, useValue: { log: async () => {} } },
        {
          provide: SanitizeService,
          useValue: {
            sanitizeText: (value: string) => value,
            sanitizeUrl: (value: string) => value,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGithub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
