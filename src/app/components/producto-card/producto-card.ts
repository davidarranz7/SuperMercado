import { Component, input, inject} from '@angular/core';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-producto-card',
  imports: [],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  producto = input.required<Producto>();
  protected carritoService = inject(CarritoService);

  agregar() {
    this.carritoService.agregarAlCarrito(this.producto());
  }
}
