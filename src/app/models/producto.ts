export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  icono: string;
  imagen?: string;
  sku?: string;
  stock?: number;
}
