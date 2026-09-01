import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { map, switchMap, throwError } from 'rxjs';

import { CredencialesLogin } from '../models/credenciales-login';
import { RegistroUsuario } from '../models/registro-usuario';
import { Usuario } from '../models/usuario';

type UsuarioConPassword = Usuario & {
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/usuarios';

  readonly usuarioActual = signal<Usuario | null>(null);

  readonly autenticado = computed(() => this.usuarioActual() !== null);

  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'ADMIN');

  registrar(datos: RegistroUsuario) {
    const email = datos.email.trim().toLowerCase();

    return this.http.get<UsuarioConPassword[]>(this.apiUrl).pipe(
      switchMap((usuarios) => {
        const emailExiste = usuarios.some(
          (usuario) => usuario.email.trim().toLowerCase() === email,
        );

        if (emailExiste) {
          return throwError(() => new Error('EMAIL_EXISTENTE'));
        }

        const nuevoUsuario: Omit<UsuarioConPassword, 'id'> = {
          nombre: datos.nombre.trim(),
          email,
          password: datos.password,
          rol: 'CLIENTE',
        };

        return this.http.post<UsuarioConPassword>(this.apiUrl, nuevoUsuario);
      }),
    );
  }

  iniciarSesion(credenciales: CredencialesLogin) {
    const email = credenciales.email.trim().toLowerCase();

    return this.http.get<UsuarioConPassword[]>(this.apiUrl).pipe(
      map((usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (usuario) =>
            usuario.email.trim().toLowerCase() === email &&
            usuario.password === credenciales.password,
        );

        if (!usuarioEncontrado) {
          throw new Error('CREDENCIALES_INVALIDAS');
        }

        const usuario: Usuario = {
          id: usuarioEncontrado.id,
          nombre: usuarioEncontrado.nombre,
          email: usuarioEncontrado.email,
          rol: usuarioEncontrado.rol,
        };

        this.usuarioActual.set(usuario);

        return usuario;
      }),
    );
  }

  establecerSesion(usuario: Usuario) {
    this.usuarioActual.set(usuario);
  }

  cerrarSesion() {
    this.usuarioActual.set(null);
  }
}
