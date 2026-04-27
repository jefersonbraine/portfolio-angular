import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { vi } from 'vitest';

import { Projetos } from './projetos';

describe('Projetos', () => {
  let component: Projetos;
  let fixture: ComponentFixture<Projetos>;

  beforeEach(async () => {
    vi.spyOn(Projetos.prototype, 'ngOnInit').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [Projetos],
      providers: [{ provide: Firestore, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(Projetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
