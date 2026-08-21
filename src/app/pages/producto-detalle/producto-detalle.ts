import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Productos } from '../../services/productos';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-detalle',
  imports: [],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss',
})
export class ProductoDetalle {
  private readonly route = inject(ActivatedRoute);

  private readonly productoService = inject(Productos);

  protected readonly productoId = this.route.snapshot.paramMap.get('id');

  protected readonly producto = signal<Producto | null>(null);

  ngOnInit() {
    if (!this.productoId) {
      console.error('No se proporcionó un ID de producto en la ruta.');
      return;
    }

    this.productoService.obtenerProductoPorId(this.productoId).subscribe({
      next: (producto) => {
        this.producto.set(producto);
      },
    });
  }
}
