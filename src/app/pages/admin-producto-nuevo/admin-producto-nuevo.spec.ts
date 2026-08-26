import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductoNuevo } from './admin-producto-nuevo';

describe('AdminProductoNuevo', () => {
  let component: AdminProductoNuevo;
  let fixture: ComponentFixture<AdminProductoNuevo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductoNuevo],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductoNuevo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
