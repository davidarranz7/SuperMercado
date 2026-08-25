import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { CarritoService } from '../../services/carrito';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Producto } from '../../models/producto';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-producto-detalle',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss',
})
export class ProductoDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(Productos);
  protected readonly carritoService = inject(CarritoService);

  protected readonly productoId = this.route.snapshot.paramMap.get('id');

  protected readonly producto = signal<Producto | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly cantidadEnCarrito = computed(() => {
    const producto = this.producto();

    if (!producto) {
      return 0;
    }

    const item = this.carritoService.items().find((item) => item.producto.id === producto.id);

    return item?.cantidad ?? 0;
  });

  ngOnInit() {
    if (!this.productoId) {
      this.error.set('Producto no válido.');
      this.cargando.set(false);
      return;
    }

    this.productoService
      .obtenerProductoPorId(this.productoId)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('Error al cargar el producto:', err);

          if (err.status === 404) {
            this.error.set('Producto no encontrado.');
          } else {
            this.error.set(
              'No se ha podido cargar el producto. Por favor, inténtalo de nuevo más tarde.',
            );
          }

          return EMPTY;
        }),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe((producto) => {
        this.producto.set(producto);
      });
  }
}
