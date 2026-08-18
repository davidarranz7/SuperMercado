import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [CurrencyPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  protected carritoService = inject(CarritoService);
}
