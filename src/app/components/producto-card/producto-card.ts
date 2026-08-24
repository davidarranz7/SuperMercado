import { Component, input, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-producto-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss',
})
export class ProductoCard {
  producto = input.required<Producto>();
  protected carritoService = inject(CarritoService);

  agregar() {
    this.carritoService.agregarAlCarrito(this.producto());
  }

  protected readonly cantidadEnCarrito = computed(() => {
    const item = this.carritoService
      .items()
      .find((item) => item.producto.id === this.producto().id);

    return item?.cantidad ?? 0;
  });
}
