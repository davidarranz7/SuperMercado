import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Productos } from '../../services/productos';

@Component({
  selector: 'app-admin-producto-nuevo',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-producto-nuevo.html',
  styleUrl: './admin-producto-nuevo.scss',
})
export class AdminProductoNuevo implements OnInit {
  protected readonly productoService = inject(Productos);

  private readonly router = inject(Router);

  protected readonly imagenPreview = signal<string | null>(null);

  protected readonly errorImagen = signal<string | null>(null);

  protected readonly imagenUrl = signal('');

  protected readonly origenImagen = signal<'archivo' | 'url' | null>(null);

  protected readonly formularioProducto = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
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
  });

  ngOnInit() {
    if (this.productoService.productos().length === 0) {
      this.productoService.cargarProductos();
    }
  }

  protected cancelar() {
    this.router.navigate(['/admin/productos']);
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
