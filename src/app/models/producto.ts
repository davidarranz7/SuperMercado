export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;

  sku?: string;
  stock?: number;

  descripcion?: string;
  coste?: number;
  etiquetas?: string[];
  publicado?: boolean;
}
