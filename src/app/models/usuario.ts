export type RolUsuario = 'ADMIN' | 'CLIENTE';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}
