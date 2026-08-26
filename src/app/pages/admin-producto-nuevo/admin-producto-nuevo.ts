import { Component, inject, OnInit } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Productos } from '../../services/productos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-producto-nuevo',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-producto-nuevo.html',
  styleUrl: './admin-producto-nuevo.scss',
})
export class AdminProductoNuevo implements OnInit {
  protected readonly productoService = inject(Productos);
  private readonly router = inject(Router);

  protected readonly formularioProducto = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    precio: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),

    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),

    sku: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    icono: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    imagen: new FormControl('', {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected cancelar() {
    this.router.navigate(['/admin/productos']);
  }

  protected guardarProducto() {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const producto = this.formularioProducto.getRawValue();

    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        this.productoService.cargarProductos();
        this.router.navigate(['/admin/productos']);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
      },
    });
  }
}
