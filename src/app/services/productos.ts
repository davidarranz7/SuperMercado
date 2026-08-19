import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class Productos {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/productos';

  readonly productos = signal<Producto[]>([]);

  obtenerProductos() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  cargarProductos() {
    this.obtenerProductos().subscribe((productos) => {
      this.productos.set(productos);
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
