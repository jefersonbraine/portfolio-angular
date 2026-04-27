import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { vi } from 'vitest';

import { Cursos } from './cursos';

describe('Cursos', () => {
  let component: Cursos;
  let fixture: ComponentFixture<Cursos>;

  beforeEach(async () => {
    vi.spyOn(Cursos.prototype, 'ngOnInit').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [Cursos],
      providers: [{ provide: Firestore, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(Cursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
