import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { tap } from 'rxjs';

import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root',
})
export class Categorias {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/categorias';

  readonly categorias = signal<Categoria[]>([]);

  obtenerCategorias() {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  crearCategoria(categoria: Omit<Categoria, 'id'>) {
    return this.http.post<Categoria>(this.apiUrl, categoria).pipe(
      tap((categoriaCreada) => {
        this.categorias.update((categorias) => [...categorias, categoriaCreada]);
      }),
    );
  }

  actualizarCategoria(id: string, cambios: Partial<Categoria>) {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, cambios).pipe(
      tap((categoriaActualizada) => {
        this.categorias.update((categorias) =>
          categorias.map((categoria) => (categoria.id === id ? categoriaActualizada : categoria)),
        );
      }),
    );
  }

  eliminarCategoria(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.categorias.update((categorias) =>
          categorias.filter((categoria) => categoria.id !== id),
        );
      }),
    );
  }

  cargarCategorias() {
    this.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
      },

      error: (error) => {
        console.error('Error al cargar las categorías:', error);
      },
    });
  }
}
