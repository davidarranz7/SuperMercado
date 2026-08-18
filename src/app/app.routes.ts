import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'carrito', component: Carrito },
];
