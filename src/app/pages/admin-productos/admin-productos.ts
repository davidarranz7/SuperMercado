import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Producto } from '../../models/producto';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-admin-productos',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.scss',
})
export class AdminProductos implements OnInit {
  protected readonly productoService = inject(Productos);

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

    icono: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly totalProductos = computed(() => this.productoService.productos().length);

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected obtenerEstadoStock(producto: Producto) {
    const stock = producto.stock ?? 0;

    if (stock === 0) {
      return 'Agotado';
    }

    if (stock <= 20) {
      return 'Stock Bajo';
    }

    return 'Activo';
  }
}
