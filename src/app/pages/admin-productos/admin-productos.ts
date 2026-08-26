import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Productos } from '../../services/productos';

@Component({
  selector: 'app-admin-productos',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.scss',
})
export class AdminProductos implements OnInit {
  protected readonly productoService = inject(Productos);

  protected readonly totalProductos = computed(() => this.productoService.productos().length);

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }
}
