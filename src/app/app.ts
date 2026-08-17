import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CarritoService } from './services/carrito';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('supermercado');
  protected carritoService = inject(CarritoService);
  protected panelAbierto = signal(false);

  alternarPanel() {
    this.panelAbierto.update(abierto => !abierto);
  }
}
