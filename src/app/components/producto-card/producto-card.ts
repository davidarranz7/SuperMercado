import { Component, input, inject} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-producto-card',
  imports: [CurrencyPipe],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss',
})
export class ProductoCard {
  producto = input.required<Producto>();
  protected carritoService = inject(CarritoService);

  agregar() {
    this.carritoService.agregarAlCarrito(this.producto());
  }
}
