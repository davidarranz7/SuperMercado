import { Routes } from '@angular/router';

import { AdminLayout } from './layouts/admin-layout/admin-layout';

import { AdminProductos } from './pages/admin-productos/admin-productos';
import { Carrito } from './pages/carrito/carrito';
import { Catalogo } from './pages/catalogo/catalogo';
import { Home } from './pages/home/home';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { AdminProductoNuevo } from './pages/admin-producto-nuevo/admin-producto-nuevo';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'catalogo',
    component: Catalogo,
  },
  {
    path: 'carrito',
    component: Carrito,
  },
  {
    path: 'producto/:id',
    component: ProductoDetalle,
  },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full',
      },
      {
        path: 'productos',
        component: AdminProductos,
      },
      {
        path: 'productos/nuevo',
        component: AdminProductoNuevo,
      },
      {
        path: 'productos/:id/editar',
        component: AdminProductoNuevo,
      },
      {
        path: 'categorias',
        component: AdminCategorias,
      },
    ],
  },
];
