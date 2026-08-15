import { Injectable, signal, computed } from '@angular/core';
import { ItemCarrito } from '../models/item-carrito';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class Carrito {
  readonly items = signal<ItemCarrito[]>([]);

  agregarAlCarrito(producto: Producto) {
    this.items.update(itemsActuales => {
      const yaExisteEnCarrito = itemsActuales.some(item => item.producto.id === producto.id);

      if (yaExisteEnCarrito) {
        return itemsActuales.map(item => 
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...itemsActuales, { producto, cantidad: 1 }];
      }
    });
  }

    readonly total = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0)
  );
}