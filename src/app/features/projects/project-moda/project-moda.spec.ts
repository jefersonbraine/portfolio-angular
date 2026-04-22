import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectModa } from './project-moda';

describe('ProjectModa', () => {
  let component: ProjectModa;
  let fixture: ComponentFixture<ProjectModa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectModa],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectModa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
