import { Component, inject, OnInit } from '@angular/core';
import { Productos } from '../../services/productos';
import { ProductoCard } from '../../components/producto-card/producto-card';

@Component({
  selector: 'app-home',
  imports: [ProductoCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected productoService = inject(Productos);

  ngOnInit() {
    this.productoService.cargarProductos();
  }
}
