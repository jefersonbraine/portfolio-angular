import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInfoCards } from './admin-info-cards';

describe('AdminInfoCards', () => {
  let component: AdminInfoCards;
  let fixture: ComponentFixture<AdminInfoCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInfoCards],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInfoCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
