import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  protected readonly busquedaAdmin = signal('');
  protected readonly categoriaAdmin = signal('Todas');

  protected readonly productosFiltrados = computed(() => {
    const busqueda = this.busquedaAdmin().trim().toLowerCase();

    const categoria = this.categoriaAdmin();

    return this.productoService.productos().filter((producto) => {
      const coincideBusqueda =
        !busqueda ||
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.sku?.toLowerCase().includes(busqueda);

      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      return coincideBusqueda && coincideCategoria;
    });
  });
  protected readonly totalProductos = computed(() => this.productoService.productos().length);

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }
}
