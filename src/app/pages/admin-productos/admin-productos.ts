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

  protected readonly estadoStockAdmin = signal<'Todos' | 'En stock' | 'Stock bajo' | 'Agotado'>(
    'Todos',
  );

  protected readonly productosFiltrados = computed(() => {
    const busqueda = this.busquedaAdmin().trim().toLowerCase();

    const categoria = this.categoriaAdmin();

    const estadoStock = this.estadoStockAdmin();

    return this.productoService.productos().filter((producto) => {
      const coincideBusqueda =
        !busqueda ||
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.sku?.toLowerCase().includes(busqueda);

      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      const stock = producto.stock ?? 0;

      const coincideStock =
        estadoStock === 'Todos' ||
        (estadoStock === 'En stock' && stock > 20) ||
        (estadoStock === 'Stock bajo' && stock > 0 && stock <= 20) ||
        (estadoStock === 'Agotado' && stock === 0);

      return coincideBusqueda && coincideCategoria && coincideStock;
    });
  });
  protected readonly totalProductos = computed(() => this.productoService.productos().length);

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected seleccionarEstadoStock(estado: 'En stock' | 'Stock bajo' | 'Agotado') {
    if (this.estadoStockAdmin() === estado) {
      this.estadoStockAdmin.set('Todos');

      return;
    }

    this.estadoStockAdmin.set(estado);
  }
}
