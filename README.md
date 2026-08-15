# SupeMercado

Aplicación de supermercado construida con Angular 21, como proyecto de práctica.

## Stack

- Angular 21 (standalone components, signals, zoneless)
- TypeScript

## Estructura del proyecto

src/app/
├── models/      # Interfaces de datos
├── services/    # Lógica y datos compartidos
├── components/  # Piezas reutilizables
├── pages/       # Pantallas ligadas a una ruta

## Funcionalidades

- [ ] Listado de productos
- [ ] Búsqueda por nombre
- [ ] Filtro por categoría
- [ ] Carrito de la compra



## paso 1

lo primero que he hecho fue crear un models donde indicare los atributos de mi clase producto
- ng g i models/producto

export interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    icono: string;
}

## paso 2
he creado el servicio de la clase producto asi podre traer los atributos de esta y asi hardcodear productos de prueba que en el futuro vendran de la base de datos que nos enviara el back y la base de datos

-ng g s services/productos

para empezar a poner codigo tenemos que acordarnos que para importar la ruta donde esta la clase que hemos creado lña de producto

-import { Producto } from '../models/producto';

es muy importante ya que si no lo haces el problema que habra es que no te deje crear los productos ya que no reconoce la palabra Producto entonces no puede comprobar que los objetos que se han hardcodeado tengan la forma correcta .

## paso 3
el siugiente paso seria generar un componente para poder pintar cada producto:

-ng g c components/producto-card

este componente no va a tener lo datos del producto dentro de el por que cada vez que lo use tiene que mostrar un producto distino,manzana,platano etc loq ue queremosq ue el html sea el mismo archivo siempre y entonces apra poder rellenar cada producto utilizaremos input

## paso 4
cuando hayamos generado todo el apquete nuevo lo que haremos es que debemos entrar en producto-card.ts y debemnos añadir dos cosas lo mas importante la clase producto y el imput

-import { Producto } from '../../models/producto';
-import { input } from '@angular/core';

luego cuando exportemos la clase que nos genero debemos crear una variable llamada producto en la cual creamos una caja "input" obligatoria utilizando la clase prodcuto..

## paso 5
lo que ahremos es entrar en su propio html y generar la palantilla que queremoa hacer llamando a la variable que hemos creado antes con cada atributo asi

<!--
<div class="tarjeta">
    <span class="icono">{{ producto().icono }}</span>
    <p class="categoria">{{ producto().categoria }}</p>
    <h3>{{ producto().nombre }}</h3>
    <p class="precio">{{ producto().precio }}</p>
    <button>+</button>
</div> 
-->

cada uno ponemos producto el nombre que le dimos a la variable y . (atributo)

## paso 6 
vamos a generar la pantalla principal y apara eso ya empezaremos a crear la pagina principal asi que lanzamos este comando

-ng g c pages/home

acto seguido deberiamos de ir a app.routes.ts y añadir la ruta de esta quedari asi

<!--
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
   { path: '', component: Home },
];
-->

## paso 7

una vez que hayamos creado las rutas lo que haremos es entrar en home.ts e inyectar
Productos, el servicio, para poder leer el array de productos que hay. tambien
añadimos ProductoCard, el componente, para poder usar la etiqueta <app-producto-card>

<!--
import { Component, inject } from '@angular/core';
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
}

-->
## paso 8
para poder conseguir lo del filtrado por nombre y por categoria en home.ts tendremos que hacer la logica, para eso tendremos que utilizar el signal que lo que hacia era un 2componente" que podria cambiar de valor

- protected busqueda = signal('');
- protected categoriaActiva = signal('Todos');

creandoa  su vez dos variables la de busqueda para el nombre y la segunda para el nombre de categoria

La cosa mas facil seria filtrar sobre producto service que injecta todos los productos de la array pero esto a niviel profesional no seria efectivo ya que tendria que lee toda la array
y rescribirse constantemente a mano cada vez que el valor cambie para solucionar eso utilizaremos computed()

computed() crea un solo signal de solo lectura que calcula su valor a partir de otros signals (busqueda() y categoriaActiva()) y se recalcula el solo cada vez que cualquiera de los dos cambia sin que el usuario lo mande hacer..

Asi productosFiltrados siempre tiene la lista correcta actualizada y asi en el html solo pintare los prodcutos filtrados,el siguiente paso seria conectar los botones input al html

## paso 9
para empezar a añadir el buscador vamos a saber que vamos a querer,si queremos un buscador que haga la busqueda una vez le demos a un evento buscar por ejemplo (click) a enviar utilizaremos "click" pero si lo que buscamos es que a medida que el campo se modifique debemos utilizar (input)

- <input #buscadorInput type="text" placeholder="Buscar productos..." (input)="busqueda.set(buscadorInput.value)">

Luego creamos una variable hardcodeada con las categorias para luego asi poder pintarlas... de momento es asi pero en un futuro lo ahremos mas limpio y que cuando se añada un producto si es una categoria nueva se ñada sinq ue nosotros tengamos que añadirla aqui asi evitaremos errores..

 esto lo ponemos en home.ts
-protected categorias = ['Todos', 'Frutas', 'Verduras', 'Carnes', 'Panadería'];

por ultimo, en el grid de productos, tengo que cambiar el @for para que recorra
productosFiltrados() en vez de productosService.productos. si dejo el array
completo sin filtrar, el buscador y las categorias podrian cambiar de signal
por dentro, pero en pantalla se seguirian viendo siempre los 6 productos, porque
el bucle nunca estaria mirando el resultado filtrado, solo el catalogo entero.

- @for (producto of productosFiltrados(); track producto.id) 

con esto ya el html pinta solo lo que sale de computed(), que se mantiene
actualizado solo cada vez que busqueda o categoriaActiva cambian.

## paso 10
el siguiente paso que haremos sera el añadir un carrito... para ello debemos saber la relacion que ahy... por ejemplo si creamos una clase itemCarrito tendremos que saber que cada carrito tiene un producto y cada producto puede haber un numero de ese mismo producto..
de momento no vamos a generar relacion de carritos con usuario ya que ahora mismo solo tenemos una persona que esta en la web y no necesita identificarse ni hacer nada.

entonces lo que necesitamos por ahora es

- ng g i models/item-carrito

y en el item-carrito.ts deberiamos de importar la clase producto y definir los atributos de item carrito lo dejariamos asi:

- import { Producto } from "./producto";

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

## paso 11
para poder crear el servicio que daria el carrito primero lo que tendremos que hacer es crear en la carpeta de services el carrito entonces lanzamos el comando

- ng g s services/carrito

luego entramos en carrito.ts y lo que ahremos es en la calse es crear una variable que recorra todos los items de carrito

- readonly items = signal<ItemCarrito[]>([]);

y tambien importamos ItemCarrito

## paso 12
por ultimo deberiamos añadir el metodo de agregarAlCarrito, pero teniendo en cuenta de que si el producto ya estaba en el carrito o es nuevo( de suamr cantidad o crear una linea nueva) 

para comprobar se utiliza some() solo devuelve true o false

- const yaEstaEnCarrito = itemsActuales.some(item => item.producto.id === producto.id);
 
si sale por ejemplo true recorremos los items con .map() y al item que coicida le sumamos 1 en la cantidad pero el resto lo dejamos igual

<!--
itemsActuales.map(item =>
  item.producto.id === producto.id
    ? { ...item, cantidad: item.cantidad + 1 }
    : item
);
-->

si por el contrario da false creo un array nuevo con todo lo de antes mas una linea nueva con cantidad 1

- return [...itemsActuales, { producto, cantidad: 1 }];

## paso 13
seria hacer la logica de acumulador y para eso utilizaremos el computed, creamos la variable total, para sumar todo el array en un unico numero se usa .reduce(), este devuelve un univo vslot final acumulado elemento a elemento.

<!--
readonly total = computed(() =>
  this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0)
);
-->

suma es el total acumulado hasta el momento, item es el elemento actual del array en cada vuelta se le suma el precio del prodcuto mltiplicado por la cantidad,para poder sumar bien debemos marcar cual es el incio y por eso ponemos 0

## paso 14
para que le boton + de cada tarjeta añada de verdad al carrito

## Cómo arrancar el proyecto
\`\`\`bash
npm install
ng serve -o
\`\`\`