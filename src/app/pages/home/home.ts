import { Component, inject, signal, computed } from '@angular/core';
import { Productos } from '../../services/productos';
import { ProductoCard } from '../../components/producto-card/producto-card';

@Component({
  selector: 'app-home',
  imports: [ProductoCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected productosService = inject(Productos);

  protected busqueda = signal('');
  protected categoriaActiva = signal('Todos');

  protected productosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const categoria = this.categoriaActiva();

    return this.productosService.productos.filter((producto) => {
      const coincideTexto = producto.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;
      
      return coincideTexto && coincideCategoria;
    });
  });

  protected categorias = ['Todos', 'Frutas', 'Verduras', 'Carnes', 'Panadería'];
}
