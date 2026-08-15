import { Component, input } from '@angular/core';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-card',
  imports: [],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  producto = input.required<Producto>();
}
