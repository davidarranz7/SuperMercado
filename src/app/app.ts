import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { CarritoService } from './services/carrito';
import { Productos } from './services/productos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('supermercado');

  protected carritoService = inject(CarritoService);
  protected productoService = inject(Productos);

  private router = inject(Router);

  protected panelAbierto = signal(false);

  alternarPanel() {
    this.panelAbierto.update((abierto) => !abierto);
  }

  buscar(texto: string) {
    this.productoService.busqueda.set(texto);
    this.productoService.categoriaActiva.set('Todos');

    if (this.router.url !== '/catalogo') {
      this.router.navigate(['/catalogo']);
    }
  }
}
