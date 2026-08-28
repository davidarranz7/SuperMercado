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

  protected readonly categoriaAdmin = signal('Todos');

  protected readonly estadoStockAdmin = signal<'Todos' | 'En stock' | 'Stock bajo' | 'Agotado'>(
    'Todos',
  );

  protected readonly paginaActual = signal(1);

  protected readonly productosPorPagina = 10;

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

  protected readonly productosActivos = computed(
    () => this.productoService.productos().filter((producto) => (producto.stock ?? 0) > 20).length,
  );

  protected readonly porcentajeActivos = computed(() => {
    const total = this.totalProductos();

    if (total === 0) {
      return 0;
    }

    return Math.round((this.productosActivos() / total) * 100);
  });

  protected readonly totalPaginas = computed(() =>
    Math.ceil(this.productosFiltrados().length / this.productosPorPagina),
  );

  protected readonly paginas = computed<(number | '...')[]>(() => {
    const total = this.totalPaginas();

    const actual = this.paginaActual();

    if (total <= 5) {
      return Array.from({ length: total }, (_, indice) => indice + 1);
    }

    if (actual <= 3) {
      return [1, 2, 3, '...', total];
    }

    if (actual >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    return [1, '...', actual - 1, actual, actual + 1, '...', total];
  });

  protected readonly productosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.productosPorPagina;

    const fin = inicio + this.productosPorPagina;

    return this.productosFiltrados().slice(inicio, fin);
  });

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected seleccionarEstadoStock(estado: 'En stock' | 'Stock bajo' | 'Agotado') {
    if (this.estadoStockAdmin() === estado) {
      this.estadoStockAdmin.set('Todos');
      this.paginaActual.set(1);

      return;
    }

    this.estadoStockAdmin.set(estado);
    this.paginaActual.set(1);
  }

  protected cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }

    this.paginaActual.set(pagina);
  }
  protected buscarProducto(texto: string) {
    this.busquedaAdmin.set(texto);
    this.paginaActual.set(1);
  }

  protected seleccionarCategoria(categoria: string) {
    this.categoriaAdmin.set(categoria);
    this.paginaActual.set(1);
  }
}
