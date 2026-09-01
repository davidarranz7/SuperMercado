import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { of, switchMap } from 'rxjs';

import { Categoria } from '../../models/categoria';
import { Categorias } from '../../services/categorias';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-admin-categorias',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.scss',
})
export class AdminCategorias implements OnInit {
  protected readonly categoriaService = inject(Categorias);

  protected readonly productoService = inject(Productos);

  protected readonly modalAbierto = signal(false);

  protected readonly guardando = signal(false);

  protected readonly errorNombre = signal<string | null>(null);

  protected readonly categoriaEditando = signal<Categoria | null>(null);

  protected readonly categoriaPendienteEliminar = signal<Categoria | null>(null);

  protected readonly errorEliminar = signal<string | null>(null);

  protected readonly eliminando = signal(false);

  protected readonly formularioCategoria = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    if (this.categoriaService.categorias().length === 0) {
      this.categoriaService.cargarCategorias();
    }

    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected abrirModal() {
    this.categoriaEditando.set(null);
    this.formularioCategoria.reset();
    this.errorNombre.set(null);
    this.modalAbierto.set(true);
  }

  protected abrirModalEditar(categoria: Categoria) {
    this.categoriaEditando.set(categoria);

    this.formularioCategoria.patchValue({
      nombre: categoria.nombre,
    });

    this.errorNombre.set(null);
    this.modalAbierto.set(true);
  }

  protected cerrarModal() {
    this.formularioCategoria.reset();
    this.errorNombre.set(null);
    this.categoriaEditando.set(null);
    this.modalAbierto.set(false);
  }

  protected guardarCategoria() {
    if (this.formularioCategoria.invalid) {
      this.formularioCategoria.markAllAsTouched();

      return;
    }

    const nombre = this.formularioCategoria.controls.nombre.value.trim();

    if (!nombre) {
      return;
    }

    const categoriaActual = this.categoriaEditando();

    const categoriaDuplicada = this.categoriaService
      .categorias()
      .some(
        (categoria) =>
          categoria.nombre.trim().toLowerCase() === nombre.toLowerCase() &&
          categoria.id !== categoriaActual?.id,
      );

    if (categoriaDuplicada) {
      this.errorNombre.set('Ya existe una categoría con este nombre.');

      return;
    }

    this.errorNombre.set(null);
    this.guardando.set(true);

    if (categoriaActual) {
      const nombreAnterior = categoriaActual.nombre;

      const actualizarProductos$ =
        nombreAnterior === nombre
          ? of([])
          : this.productoService.actualizarCategoriaProductos(nombreAnterior, nombre);

      actualizarProductos$
        .pipe(
          switchMap(() =>
            this.categoriaService.actualizarCategoria(categoriaActual.id, {
              nombre,
            }),
          ),
        )
        .subscribe({
          next: () => {
            this.guardando.set(false);
            this.cerrarModal();
          },

          error: (error) => {
            console.error('Error al actualizar la categoría:', error);

            this.guardando.set(false);
          },
        });

      return;
    }

    this.categoriaService
      .crearCategoria({
        nombre,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrarModal();
        },

        error: (error) => {
          console.error('Error al crear la categoría:', error);

          this.guardando.set(false);
        },
      });
  }

  protected abrirModalEliminar(categoria: Categoria) {
    const tieneProductos = this.productoService
      .productos()
      .some((producto) => producto.categoria === categoria.nombre);

    this.categoriaPendienteEliminar.set(categoria);

    if (tieneProductos) {
      this.errorEliminar.set('No puedes eliminar esta categoría porque tiene productos asociados.');

      return;
    }

    this.errorEliminar.set(null);
  }

  protected cerrarModalEliminar() {
    this.categoriaPendienteEliminar.set(null);
    this.errorEliminar.set(null);
    this.eliminando.set(false);
  }

  protected confirmarEliminar() {
    const categoria = this.categoriaPendienteEliminar();

    if (!categoria || this.errorEliminar()) {
      return;
    }

    const tieneProductos = this.productoService
      .productos()
      .some((producto) => producto.categoria === categoria.nombre);

    if (tieneProductos) {
      this.errorEliminar.set('No puedes eliminar esta categoría porque tiene productos asociados.');

      return;
    }

    this.eliminando.set(true);

    this.categoriaService.eliminarCategoria(categoria.id).subscribe({
      next: () => {
        this.cerrarModalEliminar();
      },

      error: (error) => {
        console.error('Error al eliminar la categoría:', error);

        this.eliminando.set(false);
      },
    });
  }
}
