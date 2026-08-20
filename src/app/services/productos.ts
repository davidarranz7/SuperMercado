import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Productos {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/productos';

  readonly productos = signal<Producto[]>([]);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  obtenerProductos() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  cargarProductos() {
    this.cargando.set(true);
    this.error.set(null);

    this.obtenerProductos()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (productos) => this.productos.set(productos),
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.error.set('Error al cargar productos. Por favor, inténtalo de nuevo más tarde.');
        },
      });
  }

  readonly categorias = computed(() => [
    'Todos',
    ...new Set(this.productos().map((producto) => producto.categoria)),
  ]);

  readonly busqueda = signal('');
  readonly categoriaActiva = signal('Todos');

  readonly productosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const categoria = this.categoriaActiva();

    return this.productos().filter((producto) => {
      const coincideTexto = producto.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  });
}
