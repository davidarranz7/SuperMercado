import { Component, inject, OnInit } from '@angular/core';

import { ProductoCard } from '../../components/producto-card/producto-card';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo implements OnInit {
  protected productoService = inject(Productos);

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }
}
