import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(Auth);

  private readonly router = inject(Router);

  protected readonly cargando = signal(false);

  protected readonly errorLogin = signal<string | null>(null);

  protected readonly mostrarPassword = signal(false);

  protected readonly formularioLogin = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected alternarPassword() {
    this.mostrarPassword.update((valor) => !valor);
  }

  protected iniciarSesion() {
    this.errorLogin.set(null);

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();

      return;
    }

    const credenciales = this.formularioLogin.getRawValue();

    this.cargando.set(true);

    this.authService
      .iniciarSesion({
        email: credenciales.email,
        password: credenciales.password,
      })
      .subscribe({
        next: (usuario) => {
          this.cargando.set(false);

          if (usuario.rol === 'ADMIN') {
            this.router.navigateByUrl('/admin/productos');

            return;
          }

          this.router.navigateByUrl('/');
        },

        error: (error) => {
          this.cargando.set(false);

          if (error.message === 'CREDENCIALES_INVALIDAS') {
            this.errorLogin.set('El correo electrónico o la contraseña no son correctos.');

            return;
          }

          this.errorLogin.set('No se pudo iniciar sesión. Inténtalo de nuevo.');

          console.error('Error al iniciar sesión:', error);
        },
      });
  }
}
