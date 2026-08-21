import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Carrito } from './pages/carrito/carrito';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'carrito', component: Carrito },
  { path: 'producto/:id', component: ProductoDetalle },
];
