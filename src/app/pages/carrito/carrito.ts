import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  protected carritoService = inject(CarritoService);
}
