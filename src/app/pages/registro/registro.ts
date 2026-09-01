import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private readonly authService = inject(Auth);

  protected readonly guardando = signal(false);

  protected readonly errorRegistro = signal<string | null>(null);

  protected readonly registroCompletado = signal(false);

  protected readonly mostrarPassword = signal(false);

  protected alternarPassword() {
    this.mostrarPassword.update((valor) => !valor);
  }

  protected readonly formularioRegistro = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),

    confirmarPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected registrar() {
    this.errorRegistro.set(null);
    this.registroCompletado.set(false);

    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();

      return;
    }

    const datos = this.formularioRegistro.getRawValue();

    if (datos.password !== datos.confirmarPassword) {
      this.errorRegistro.set('Las contraseñas no coinciden.');

      return;
    }

    this.guardando.set(true);

    this.authService
      .registrar({
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.registroCompletado.set(true);
          this.formularioRegistro.reset();
        },

        error: (error) => {
          this.guardando.set(false);

          if (error.message === 'EMAIL_EXISTENTE') {
            this.errorRegistro.set('Ya existe una cuenta con este correo electrónico.');

            return;
          }

          this.errorRegistro.set('No se pudo completar el registro. Inténtalo de nuevo.');

          console.error('Error al registrar el usuario:', error);
        },
      });
  }
}
