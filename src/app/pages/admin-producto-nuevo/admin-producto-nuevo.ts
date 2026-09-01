import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Categorias } from '../../services/categorias';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-admin-producto-nuevo',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-producto-nuevo.html',
  styleUrl: './admin-producto-nuevo.scss',
})
export class AdminProductoNuevo implements OnInit {
  protected readonly productoService = inject(Productos);

  protected readonly categoriaService = inject(Categorias);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly productoId = this.route.snapshot.paramMap.get('id');

  protected readonly esEdicion = this.productoId !== null;

  protected readonly imagenPreview = signal<string | null>(null);

  protected readonly errorImagen = signal<string | null>(null);

  protected readonly imagenUrl = signal('');

  protected readonly errorSku = signal<string | null>(null);

  protected readonly origenImagen = signal<'archivo' | 'url' | null>(null);

  protected readonly formularioProducto = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    descripcion: new FormControl('', {
      nonNullable: true,
    }),

    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    precio: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),

    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),

    sku: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    imagen: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    publicado: new FormControl(true, {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }

    if (this.categoriaService.categorias().length === 0) {
      this.categoriaService.cargarCategorias();
    }

    if (this.productoId) {
      this.cargarProductoParaEditar();
    }
  }

  private cargarProductoParaEditar() {
    if (!this.productoId) {
      return;
    }

    this.productoService.obtenerProductoPorId(this.productoId).subscribe({
      next: (producto) => {
        this.formularioProducto.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? '',
          categoria: producto.categoria,
          precio: producto.precio,
          stock: producto.stock ?? 0,
          sku: producto.sku ?? '',
          imagen: producto.imagen,
          publicado: producto.publicado ?? true,
        });

        this.imagenPreview.set(producto.imagen);

        if (producto.imagen.startsWith('data:image/')) {
          this.origenImagen.set('archivo');

          this.imagenUrl.set('');
        } else {
          this.origenImagen.set('url');

          this.imagenUrl.set(producto.imagen);
        }
      },

      error: (error) => {
        console.error('Error al cargar el producto:', error);
      },
    });
  }

  protected cancelar() {
    this.router.navigate(['/admin/productos']);
  }

  protected alternarPublicacion() {
    const publicadoActual = this.formularioProducto.controls.publicado.value;

    this.formularioProducto.controls.publicado.setValue(!publicadoActual);
  }

  protected seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/webp'];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.errorImagen.set('La imagen debe ser PNG, JPG o WEBP.');

      input.value = '';

      return;
    }

    const tamanoMaximo = 5 * 1024 * 1024;

    if (archivo.size > tamanoMaximo) {
      this.errorImagen.set('La imagen no puede superar los 5 MB.');

      input.value = '';

      return;
    }

    this.errorImagen.set(null);

    const lector = new FileReader();

    lector.onload = () => {
      const imagen = lector.result as string;

      this.imagenPreview.set(imagen);

      this.formularioProducto.controls.imagen.setValue(imagen);

      this.formularioProducto.controls.imagen.markAsTouched();

      this.origenImagen.set('archivo');

      this.imagenUrl.set('');

      input.value = '';
    };

    lector.readAsDataURL(archivo);
  }

  protected actualizarImagenDesdeUrl(event: Event) {
    const input = event.target as HTMLInputElement;

    const url = input.value.trim();

    this.imagenUrl.set(url);

    if (!url) {
      if (this.origenImagen() === 'url') {
        this.quitarImagenSeleccionada();
      }

      return;
    }

    const esUrlValida = url.startsWith('http://') || url.startsWith('https://');

    if (!esUrlValida) {
      this.errorImagen.set('Introduce una URL válida que empiece por http:// o https://');

      return;
    }

    this.errorImagen.set(null);

    this.origenImagen.set('url');

    this.imagenPreview.set(url);

    this.formularioProducto.controls.imagen.setValue(url);

    this.formularioProducto.controls.imagen.markAsTouched();
  }

  protected quitarImagenSeleccionada() {
    this.imagenPreview.set(null);

    this.imagenUrl.set('');

    this.origenImagen.set(null);

    this.errorImagen.set(null);

    this.formularioProducto.controls.imagen.setValue('');

    this.formularioProducto.controls.imagen.markAsTouched();
  }

  protected guardarProducto() {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();

      return;
    }

    const producto = this.formularioProducto.getRawValue();

    const skuDuplicado = this.productoService
      .productos()
      .some(
        (productoExistente) =>
          productoExistente.sku?.trim().toLowerCase() === producto.sku.trim().toLowerCase() &&
          productoExistente.id !== this.productoId,
      );

    if (skuDuplicado) {
      this.errorSku.set('Ya existe un producto con este SKU.');

      return;
    }

    this.errorSku.set(null);

    if (this.esEdicion && this.productoId) {
      this.productoService.actualizarProducto(this.productoId, producto).subscribe({
        next: () => {
          this.productoService.cargarProductos();

          this.router.navigate(['/admin/productos']);
        },

        error: (error) => {
          console.error('Error al actualizar el producto:', error);
        },
      });

      return;
    }

    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        this.productoService.cargarProductos();

        this.router.navigate(['/admin/productos']);
      },

      error: (error) => {
        console.error('Error al crear el producto:', error);
      },
    });
  }
}
