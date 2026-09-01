import { Component, computed, inject, OnInit } from '@angular/core';

import { ProductoCard } from '../../components/producto-card/producto-card';
import { Categorias } from '../../services/categorias';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo implements OnInit {
  protected readonly productoService = inject(Productos);

  protected readonly categoriaService = inject(Categorias);

  protected readonly categoriasVisibles = computed(() =>
    this.categoriaService
      .categorias()
      .filter((categoria) =>
        this.productoService
          .productos()
          .some(
            (producto) => producto.categoria === categoria.nombre && producto.publicado !== false,
          ),
      ),
  );

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }

    if (this.categoriaService.categorias().length === 0) {
      this.categoriaService.cargarCategorias();
    }
  }

  protected seleccionarCategoria(categoria: string) {
    this.productoService.categoriaActiva.set(categoria);
  }
}
