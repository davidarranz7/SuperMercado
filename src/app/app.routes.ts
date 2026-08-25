import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Carrito } from './pages/carrito/carrito';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { AdminProductos } from './pages/admin-productos/admin-productos';
import { Catalogo } from './pages/catalogo/catalogo';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogo', component: Catalogo },
  { path: 'carrito', component: Carrito },
  { path: 'producto/:id', component: ProductoDetalle },
  { path: 'admin/productos', component: AdminProductos },
];
