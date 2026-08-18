import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})


export class Productos {
  readonly productos: Producto[] = [
    { id: 1, nombre: 'Manzana', categoria: 'Frutas', precio: 1.5, icono: '🍎' },
    { id: 2, nombre: 'Plátano', categoria: 'Frutas', precio: 0.5, icono: '🍌' },
    { id: 3, nombre: 'Lechuga', categoria: 'Verduras', precio: 1.0, icono: '🥬' },
    { id: 4, nombre: 'Zanahoria', categoria: 'Verduras', precio: 0.8, icono: '🥕' },
    { id: 5, nombre: 'pechuga de pollo', categoria: 'Carnes', precio: 5.0, icono: '🍗' },
    {id: 6, nombre: 'Pan', categoria: 'Panadería', precio: 2.0, icono: '🍞' },
  ];

  readonly categorias = ['Todos', 'Frutas', 'Verduras', 'Carnes', 'Panadería'];

  readonly busqueda = signal('');
  readonly categoriaActiva = signal('Todos');

  readonly productosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const categoria = this.categoriaActiva();

    return this.productos.filter((producto) => {
      const coincideTexto = producto.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  });
}
