import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-productos',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.scss',
})
export class AdminProductos {
  protected readonly formularioProducto = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    precio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    icono: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}
