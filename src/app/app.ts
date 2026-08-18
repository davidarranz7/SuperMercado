import { Component, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CarritoService } from './services/carrito';
import { Productos } from './services/productos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('supermercado');
  protected carritoService = inject(CarritoService);
  protected productoService = inject(Productos);

  protected panelAbierto = signal(false);

  alternarPanel() {
    this.panelAbierto.update(abierto => !abierto);
  }
}
