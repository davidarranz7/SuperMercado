import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, EMPTY, finalize } from 'rxjs';

import { Producto } from '../models/producto';

type OrdenProductos = 'relevancia' | 'precio-asc' | 'precio-desc';

@Injectable({
  providedIn: 'root',
})
export class Productos {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/productos';

  readonly productos = signal<Producto[]>([]);

  readonly cargando = signal(false);

  readonly error = signal<string | null>(null);

  readonly busqueda = signal('');

  readonly categoriaActiva = signal('Todos');

  readonly orden = signal<OrdenProductos>('relevancia');

  readonly precioMin = signal(0);

  readonly precioMax = signal(50);

  obtenerProductos() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProductoPorId(id: string) {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  cargarProductos() {
    this.cargando.set(true);
    this.error.set(null);

    this.obtenerProductos()
      .pipe(
        catchError((error) => {
          console.error('Error al cargar productos:', error);

          this.error.set('No se pudieron cargar los productos.');

          return EMPTY;
        }),

        finalize(() => {
          this.cargando.set(false);
        }),
      )
      .subscribe((productos) => {
        this.productos.set(productos);
      });
  }

  readonly categorias = computed(() => [
    'Todos',
    ...new Set(this.productos().map((producto) => producto.categoria)),
  ]);

  readonly productosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    const categoria = this.categoriaActiva();

    return this.productos().filter((producto) => {
      const coincideTexto = producto.nombre.toLowerCase().includes(texto);

      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  });

  readonly productosCatalogo = computed(() => {
    const precioMin = this.precioMin();

    const precioMax = this.precioMax();

    const orden = this.orden();

    const productos = this.productosFiltrados().filter(
      (producto) => producto.precio >= precioMin && producto.precio <= precioMax,
    );

    if (orden === 'precio-asc') {
      return productos.sort((a, b) => a.precio - b.precio);
    }

    if (orden === 'precio-desc') {
      return productos.sort((a, b) => b.precio - a.precio);
    }

    return productos;
  });

  cambiarOrden(valor: string) {
    if (valor === 'relevancia' || valor === 'precio-asc' || valor === 'precio-desc') {
      this.orden.set(valor);
    }
  }

  cambiarPrecioMin(valor: string) {
    const nuevoPrecio = Number(valor);

    this.precioMin.set(Math.min(nuevoPrecio, this.precioMax()));
  }

  cambiarPrecioMax(valor: string) {
    const nuevoPrecio = Number(valor);

    this.precioMax.set(Math.max(nuevoPrecio, this.precioMin()));
  }

  limpiarFiltros() {
    this.busqueda.set('');

    this.categoriaActiva.set('Todos');

    this.precioMin.set(0);

    this.precioMax.set(50);

    this.orden.set('relevancia');
  }
}
