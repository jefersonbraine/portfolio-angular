import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { AuditService } from '../../../../core/services/audit.service';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';
import { vi } from 'vitest';

import { AdminProjects } from './admin-projects';

describe('AdminProjects', () => {
  let component: AdminProjects;
  let fixture: ComponentFixture<AdminProjects>;

  beforeEach(async () => {
    vi.spyOn(AdminProjects.prototype, 'ngOnInit').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [AdminProjects],
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

    fixture = TestBed.createComponent(AdminProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
