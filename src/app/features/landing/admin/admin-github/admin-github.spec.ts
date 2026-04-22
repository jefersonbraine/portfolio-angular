import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGithub } from './admin-github';

describe('AdminGithub', () => {
  let component: AdminGithub;
  let fixture: ComponentFixture<AdminGithub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGithub],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGithub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
