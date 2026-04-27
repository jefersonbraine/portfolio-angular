import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { AuditService } from '../../../../core/services/audit.service';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';
import { vi } from 'vitest';

import { AdminCourses } from './admin-courses';

describe('AdminCourses', () => {
  let component: AdminCourses;
  let fixture: ComponentFixture<AdminCourses>;

  beforeEach(async () => {
    vi.spyOn(AdminCourses.prototype, 'ngOnInit').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [AdminCourses],
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

    fixture = TestBed.createComponent(AdminCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
