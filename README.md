# SupeMercado

Aplicación de supermercado construida con Angular 21, como proyecto de práctica.

## Stack

- Angular 21 (standalone components, signals, zoneless)
- TypeScript

## Estructura del proyecto

src/app/
├── models/ # Interfaces de datos
├── services/ # Lógica y datos compartidos
├── components/ # Piezas reutilizables
├── pages/ # Pantallas ligadas a una ruta

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

creandoa su vez dos variables la de busqueda para el nombre y la segunda para el nombre de categoria

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

para que le boton + de cada tarjeta añada de verdad al carrito en producto-card tengo que juntar dos cosas el input yel inject pero esta evz juntas

<!--
producto = input.required<Producto>();
  protected carritoService = inject(Carrito);
-->

dentro añadimos un metodo que seria el de agregar

- agregar() {
  this.carritoService.agregarAlCarrito(this.producto());
  }

este metodo sirve para lee el producto que le llego por input(), en el html tendremos que conectar el boton con el agregar creando un evento que seria asi

<!--
<button (click)="agregar()">+</button>
-->

## paso 15

el siguiente paso seria generar pages/carrito, pero nos hemos dado cuenta de
que si dejamos todo como esta, la clase Carrito que tenemos en services/carrito
va a chocar con el nombre de la propia pagina cuando la generemos. para no tener que usar "as" cada vez que la importemos, hemos decidido renombrar la clase del servicio a CarritoService.

- ng g c pages/carrito

## paso 16

para poder pintar el contenido del carrito en carrito.html

- @if / @else con .length === 0
  eto sirve para que cuando el carrito este vacio muestr un mensaje de que el carrito esta vacio

- @for (item of carritoService.items(); track item.producto.id)
  esto sirve para identificar cada fila y asi poder sumarse

de momento no vamos a poder ver cambios ya que no lo hemos metido en el router asi que ese seria el siguiente paso.

## paso 17

para poder conecatr las paginas debemos acordarnos que ya no uiliza href como se hacia antes ahora loq uese utiliza es RoutesLink, pero antes de eso debemos poner la ruta en app.routes.ts

quedaria asi

<!--
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'carrito', component: Carrito }
];

-->

luego esto no va a hacer nada de momento si no le decimos que url debemos ir.. por que esto solo valdria si pusieras la url a mano pero el problema que habria seria que por mucho que tu añadas alimentos y luego escribas /carrito todos esos datos se pierden por que no se guardan por que estarias recargando toda la pagina pero en cambio como hablamos antes tendremos que utilizar ROutesLInk asi que en app.ts aparte del oulet añadiremos esta y quedaria asi

<!--
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('supermercado');
}

-->

con esto conseguimos poder utilizar lo que antes era los href entonces el app.html pasaria de solo tener un oulet a esto

<!--
<nav>
  <a routerLink="/">SuperMercado</a>
  <a routerLink="/carrito">Carrito</a>
</nav>

<router-outlet />
-->

con esto loq ue haria es pasar de url a otra sin borrar nada y conservando los datos

===========================================================================================

## paso 18

como se dice normalmente toca ponerlo bonito todo ys eguramente nos toque restructurar el esquema de html para situar todo mejor... dejo comentarios en el propio css,pero empezamos con la platilla general de la app que seria styles.css

# paso 18

Una vez que hemos modificado la estructura general lo que haremos es diseñar las zonas especificas del home de la pagina por defecto...

# paso 19

Siguiente paso seria entrar ya en el diseño de tarjetas de producto asi que lo que toca modificar es producto-card.css

## paso 20

vale esto no es ningun error, solo es simplemente una mejora ya que aunqer sea una aplcacion de un ejercicio vamos a hcerla todo lo posible para poner en funcionamiento de manera mas real.

Asi que vamos hacer que en la cabecerase vewa cuantos productos se lleva, por ejemplo si selecciono 5 manzanas y dos platanos lo que queremos mostrar es el numero de productos no la cantidad total de estas.

Para poder hacer esto volveremos a utilizar computed() pero como solo queremos contar las lineas no la cantidades de cada linea(solo nos interesa la cantidad de prodcutos no la cantidad de cada producto) si no si que tendriamos que utilizar reduce()

- readonly cantidadTotal = computed(() => this.items().length
  );

Luego para poder importarla tenemos que injectar el servicio al carrito.ts (pero del servicio) debemos añadir:

- import { CarritoService } from './services/carrito';

- protected carritoService = inject(CarritoService);

poor ultimo en el html lo que haremos(app.html)como tenemos pintado la palara carrito al lado debemos pintar tambien la funcion que tenemos del contaodr de cada producto seleecionado!!

- <a routerLink="/carrito">Carrito ({{ carritoService.cantidadTotal() }})</a>

## paso 21

Vamos a hacer ahora el panle desplegable, para no ir al carrito para ver que seleccionaste y asi poder interactuar emjor como pagina.Pero para eso un despleganble comun, es normalmente añadir y elimnar bloques o unidades entonces deberiamos primer hacer esa logica de carrito

Crearemos un metodo que lo llamaremos quitarUnidad() para eso debemos utilizar el filter para que nos devuelva una array nueva. La cosa es recorrer el array con .map para poderle restar 1 a la cantidad de ese prodcuto

<!--
  quitarUnidad(id: number) {
    this.items.update(itemsActuales => {
      return itemsActuales.map(item => item.producto.id === id ? {
        ...item, cantidad: item.cantidad - 1
      }
      : item
    )
    .filter(item => item.cantidad > 0);
    });
    -->

## paso 22

ahroa empezamos con el siguiente metodo que seria eliminar la line(el producto) sin importar cuntas unidades tenga es mas simple

- eliminarProducto(id: number) {
  this.items.update(itemsActuales => itemsActuales.filter(item => item.producto.id !== id));
  }

el !== lo utilizamos para decirle que nos quedamos con todo lo distinto al id que llevmaos de la varibale

## paso 23

el siguiente paso es conectar los metodos que hemos hecho con el html y asi poder utilizarlos de momento en el html de carrito ya que no hemos empezado con el panel lateral

asi que dentro del bucle que teniamos añadimos estas dos lineas

- <button (click)="carritoService.eliminarProducto(item.producto.id)">Eliminar</button>

- <button (click)="carritoService.quitarUnidad(item.producto.id)">-</button>

## paso 24

para empezar con el panel tenemos que hacer lo siguiente en el app.ts netemos que crear una variable la llamaremos panelAbierto para saber siempre si el panel esta abierto o no como es algo que no queremos que aparezca siemrpe al entrar a la app guardamos como false

<!--
  protected panelAbierto = signal(false);

  alternarPanel() {
    this.panelAbierto.update(abierto => !abierto);
  }
  -->

el siguiente paso es añadirlo al html de momento no se va a ver nada simplemente se mirara un texto para que podamos ver si funciona o no,para eso quitaremos el routerlink que llevaba hasta el enlace de carrito y pondremos esto

- <button (click)="alternarPanel()">Carrito ({{ carritoService.cantidadTotal() }})</button>

</nav>

pero para ver lo que trae de momento pondremos un texto simple

<!--
@if (panelAbierto()) {
  <div class="panel">
    <p>Panel abierto</p>
  </div>
}
-->

## paso 25

para poder rellenar todo
para empezar haceos un evento que es para cerrar el panel lateral

- <button (click)="alternarPanel()">Cerrar</button>

si el carrito esta vacio por e contrario tiene que haber una condicion y tendria que poner que el carrito esta vacio

- @if (carritoService.items().length === 0) {
  <p>El carrito está vacío</p>

y luego la logia que tendria la misma de carrito que teniamos en el ese html

<!--
<div class="panel-item">
  <span>{{ item.producto.icono }} {{ item.producto.nombre }}</span>
  <span>{{ item.cantidad }} x {{ item.producto.precio }} €</span>
  <button (click)="carritoService.quitarUnidad(item.producto.id)">-</button>
  <button (click)="carritoService.eliminarProducto(item.producto.id)">Eliminar</button>
   </div>
-->

luego lo siguiente lo ultimo es entrar de nuevo al carrito.html y tambien cerrar el panel si no seguiria abierto

## paso 26

El siguiente paso seria ajustar el app.css para añadir el diseño del panel lateral

## paso 27

he tenido un priblema que tiene facil solucion en el panel aparte de tener por ejemplo el eliminar unidad de un producto esataria genial el poder añadir tambien desde el panel asi que añadimos el metodo que tenemos ya en ficha que es "agregarAlCarrito" y lo añadimos al app.html

- <button (click)="carritoService.agregarAlCarrito(item.producto)">+</button>

## paso 28

he añadido hover para hacer efectos de por ejemplo eliminar o de añadir o de cerrar el panel, estoy tambien encontrando la solucion para poder alinear el nombre del producto con el precio por que no me esta gustando mucho.

## paso 29

Tenemos un problema que es que por ejemplo pongo 7 zanahorias y me sale un resultado
5.6000000000000005, eso deberia ser inviable asi que... tenemos que parchear eso,para eso deberiamos utilizar "CURRENCY"

- <p class="panel-total">Total: {{ carritoService.total() | currency:'EUR' }}</p>

para importar esto debemos importarlo en el app.ts y en el array de component

## paso 30

No hemos detectado problema simplemente queremos restructurar y poner el buscador en el header entonces tenemos que cambiar varias cosas de sitio,lo que hay que mover es la logica de home a producto service

- readonly categorias = ['Todos', 'Frutas', 'Verduras', 'Carnes', 'Panadería'];

<!--
readonly busqueda = signal('');
  readonly categoriaActiva = signal('Todos');

  readonly productosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const categoria = this.categoriaActiva();

    return this.productos.filter((producto) => {
      const coincideTexto = producto.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
-->

y home quedaria vacio ya!!!, luego cambiariamos las llamadas de busqueda y de filtro con "productoService."

## paso 31

el siguiente paso deberiamos importar en app.ts la clase productos

- import { Productos } from './services/productos';

y tambien añadimos la variable

- protected productoService = inject(Productos);

## paso 31

he cambiado un poco la estructura de la pagina y he decidio hacer un cambio que es bastante importante,el idioma de angualr por lo general es en ingles entonces cuando queria cambiar las tarjetas y ponerlas con el precio con currencypipe me salia el € y luego la cantidad por el orden ingles asi qeu tenemos uqe cambiar y modificar el app.config.ts

- registerLocaleData(localeEs);

esa linea lo que hace es que carga es el formato español

- { provide: LOCALE_ID, useValue: 'es-ES' }

esta linea lo que dice es que cuando alguienpregunte cual es el idioma de la pagina se dice español y asi solucionamos el problema del orden del signo monetario con la cantidad

## paso 32

Vamos a instalar commitlint basiacemnte para acostumbrarnos a hacer commits utiles en ingles en el formato asi...

- tipo(scope): descripción

Para eso tendremos que isntalar commitlint y husky:

- @commitlint/cli esto lo que hace es comprueba el mensaje
- @commitlint/config-conventional Contiene las reglas convencionales de commits
- husky permite ejecutar commitlint automaticamente cuando hacemos unn commit

Completo seria asi....

- node -e "fs.writeFileSync('commitlint.config.js', process.argv[1])" "export default { extends: ['@commitlint/config-conventional'] };"

Con esto lo que hace es instalar las dependencias

Luego lo que haremos es crear commitlint.config.msj

- node -e "fs.writeFileSync('commitlint.config.mjs', process.argv[1])" "export default { extends: ['@commitlint/config-conventional'] };"

esto es que commitlint utilizara las reglas glovales

para que husky lo detecte para poder conectarlo con github

- npx husky init

## paso 33

Vamos a empezar a migrar lo que llevamos hecho de estilo... Para esto loq ue vamos a empezar seria decirle a angular que apartir de ahora cuando creemos un componente no cree un css y cree un scss de acuerdo.

- "schematics": {
  "@schematics/angular:component": {
  "style": "scss"
  }
  }

## paso 34

Lo siguiente fue el ir renombrando los archivos para poder añadirle la extension correcta de css a scss.
Hemos creado una variable una carpeta conforme ponemos variables con

- @use '../../../styles/variables' as vars;

lo que hace es en ese archivo cogemos y le ponemos parametros que se repiten y para ahorrar tiempo y que se entienda todo mejor llamamos en cada css si utilizamos una varibale de esas pues llamamos a ese archivo

## paso 35

Luego instalamos ESlint

- ng add angular-eslint@21

que sirve para:
-Archivos TypeScript (.ts)
-Plantillas HTML de Angular
-Reglas específicas de Angular
-Algunas reglas de accesibilidad

Esto seria el flujo!!!!

- npm run format

corrige el formato

- npm run format:check

comprueba el formato

## paso 36

el siguiente paso qeu realizariamos el flujo que vamos a tener de json server y para eso tendremos qeu instalar la dependecia

- npm install --save-dev json-server

## paso 37

una vez que hayamos instalado el programa debemos crear un archivo en la raiz de src "db.json"
ahi lo que pondremos sera las reglas que debe cumplir el json server

- "$schema": "./node_modules/json-server/schema.json",

luego en nuesto caso haremos el array de productos...

## paso 38

tendremos que levantar el json server para ver si salen los productos

- npx json-server db.json

## paso 39

ahora que json-server esta levantado y podemos ver los productos en la URL que nos crea tendremos que dejar de tenerlo hardcodeados para asi poder traerlos desde la api.

para poder hacer peticiones http hace falta inyectar HttpClient en el servidor

- private readonly http = inject(HttpClient);
- private readonly apiUrl = 'http://localhost:3000/productos';

con esto el array de productos desparece pero se crea un signal vacio que recogera los datos desde la api

- readonly productos = signal<Producto[]>([]);

Ahora el metodo que hace la peticion es:

<!--
obtenerProductos() {
  return this.http.get<Producto[]>(this.apiUrl);
}
-->

esto no devuelve los productos esto lo uqe hace es decir que van a llegara los productos en algun momento
Por eso hace falta otro metodo que hace que se subscriba y guarde lo que llega

<!--
cargarProductos() {
  this.obtenerProductos().subscribe((productos) => {
    this.productos.set(productos);
  });
}
-->

subscribe es lo que hace la peticion de verdad y se queda esperdando:
el flujo completo: GET /productos → HttpClient → Observable → subscribe() →
productos.set(productos) → angular repinta solo

## paso 40

una peticion http puede tardar si por ejemplo hay miles y miles de datos para devolver o puede fallar entonces para esto si por ejemplo si json server estaba apagado el usuario simplemente veria nada! estaria vacio sin ninguna explicacion para eso habria que controlar esas situaciones

para eso en el servicio se crean dos signals nuevos

- readonly cargando = signal(false);
- readonly error = signal<string | null>(null);

cargando guarda si estamos esperando respuesta error guarda un mensaje si algo falla en tipo string...

ahroa cambio cargarProducto() lo primero antes de pedir nada

- this.cargando.set(true);
- this.error.set(null);

esto es como marcar como quiero que empiece la carga como siempre se tiene que poner primero el carga y si falla se ejecuta el error

y suscibre() se tendra que poner dos opciones una si todo va bien y otra si falla

<!--
next: (productos) => {
  this.productos.set(productos);
  this.cargando.set(false);
},
-->

next() se ejecuta si la peticion sale bine guarda los productos

<!--
error: () => {
  this.error.set('Error al cargar los productos');
  this.cargando.set(false);
},
-->

error() se ejecuta si falla: guardo el mensaje

luego abria que modificar el html

<!--
@if (productoService.cargando()) {
  <p>Cargando productos...</p>
} @else if (productoService.error()) {
  <p>{{ productoService.error() }}</p>
} @else {
-->

el orden importa: primero comprobar si esta cargando, luego si hay error, y
solo si no se cumple ninguna de las dos, pintar los productos.

## observable y subcribe()

observable es un flujo de datos que emite valores a lo alrgo del tiempo.
Para comunicarse con wuien esta subcrito para eso utiliza tres tipos de notificacion:
next que pueden ser muchas veces puede emetir mas valores a lo largo del tiempo!
error que dice que fallo pero no emite nada despues
complete el flujo termino bien ppero no emite nada despues

## paso 41

He mejorado la carga de products utilizando finalize,antes teniamos como repetido:

- this.cargando.set(false);

y lo utizaba tanto si la app iba bien o mal ahora utilizoesto:

- .pipe(finalize(() => this.cargando.set(false)))

lo que hace el finalize es ejecutar una accion cuando termina tanto si termina correctamente o se cancela o va bien

de esta forma podemos dejar una responsabilidad:

- next = han llegado datos y los guardamos
- error = controlamos el fallo
- finalize = hacemos la accion que siemrpe debe ocurrir al terminar

en unestro caso lo que hace es poner cargar en false asi evitamos el error duplicado en esas dos lineas...

## paso 42

he añadido un boton para reintentar la carga de productos cuanbdo la API da error

- <button (click)="productoService.cargarProductos()">Reintentar</button>

Con esto el usuario no tendria que recargar toda la pagina si no que solo le daria a un boton y se volveria a lanzar la peticion

## paso 43

Para solucionar el tema de que cuando estas buscando un producto en vez de salirte pantalla en negro haremos que si no hay ninugna coicidencia lo que haremos es que salte un mensaje diciendo "no se encontraron productos"

para eso tendremos que utilizar el emty

<!--
 @empty {
    <p>No se encontraron productos.</p>
-->

## paso 44

he cambiado la forma de controlar los errores del Observable utilizando catchError, anetes lo controlabamos el error dentro del suscribe();

ahora lo hago dentro del pipe:

- catchError((err) => {
  console.error('Error al cargar productos:', err);

  this.error.set(
  'Error al cargar productos. Por favor, inténtalo de nuevo más tarde.'
  );

  return EMPTY;
  })

catchError intercepta el error dentro del flujo del observabvle y nos permite decidir que hacer antes de entrar en el suscribe en mi caso loq ue quieroq ue muestre es EMTY que es no dar ningun valor

## paso 45

voy a crear una pagina para pintar los daetalles de cada producto y asi por lo menos poder utilizar el id
priemro generamos el componente

- ng g c pages/producto-detalle

luego añadimos una ruta dinamica en app.toutes.ts

- { path: 'producto/:id', component: ProductoDetalle }

lo del id lo que significa que esa parte de la ruta puede cambiar ":id"

anguar guarda ese valor como parametro de ruta y para poder leer utilizamos ActivateRoute:

- private readonly route = inject(ActivatedRoute);

sirve para obtener informacion de la ruta actual, no obtiene datos del producto nui de la pagina anterior

- this.route.snapshot.paramMap.get('id');

podemos obtener algo asi entonces snapshot mira el estado de la ruta en ese momento.
paramap contiene los parametros de la ruta

despues añadimos al servicio Producto un metodo para pedir un soolo producto:

- obtenerProductoPorId(id: string) {
  return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

en productoDetalle creamos un signal:

- protected readonly producto = signal<Producto | null>(null);

se empieza en null por que cuando se carga la pagina no se sabe el producto que cargamos

- this.productoService.obtenerProductoPorId(this.productoId).subscribe({
  next: (producto) => {
  this.producto.set(producto);
  },
  });

caundo llegue la respuesta guardamos el producto dentro del signal

luego en el html lo que haremos es

- @if (producto(); as producto)

dentro de producto a tiene un producto lo guardamos temporalmente como producto

mientas producto sea null mostraremos que esta cargando el producto

## paso 46

tenemos que controlar los isuientes estados de detalle de producto por que nates solo tenia:

- producto = signal<Producto | null>(null)

El problema era que null podia significar dos cosas:

- que el producto seguia cargando y eso podria pasar si habria muchisimos productos pero no deberia tardar hasta que se conecte

- que el producto no existia

Para poder separar lo que he hecho fue exactamente lo que hicimos si el json se cayese

- cargando = signal(true)
- error = signal<string | null>(null)

asi podre identificar los estados de la petiicion

- si esta la pèticion sigue en su curso cargando()
- si el producto no exist o la peticion ha fallado error()
- producto encontrado

para eso como utilice ya antes catchError utilizo de nuevo esto

luego enviare un error 404 si el prodcuto no existe
y si el servidor esta apagado pues un mensaje que lo intene mas tarde

## paso 47

Como es haitual queria añadir el + para añadir al carrito asi que lo implementamos y reutilizamos el metodo que teniamos en carrtioService

Entonces en el detalle hago lo siguiente:

- si cantidadEnCarrito() === 0 aparece el boton "Añadir al carrito"

- si cantidadEnCarrito() es mayor que 0 aparecen los controles:

luego como cantidad tenial el mismo patron he añadido una variable y la implementamos por que segurmante lo añadamos en varios lugares mnas

## paso 48

Depues de refactorizar la interfaz y darle un cambio radical lo que estamos haciendo ahora mismo es el poder crear el apnel de administracion asi que lo que hicmos es crear una pagina idependiente pero conectada a las demas apra poder crear una interfaz nueva para adminstrador

## paso 49

lo que haremos ahora sera cambiar todo pero abolutamente todo de icono por que no tendria sentido que siga utilizando un icono pero antes de eliminar la linea de db.json tendremos que cambiar todo y añadir una imagen a cada producto ya que depende el codigo de una imgen o de un icono

## paso 50

ahora el problema tenia era que ya habiamos eliminado icono de la interfaz de producto

- producto.icono
- item.producto.icono

por eso cuando lanzabamos el ng s -o nos saltaba un error ya que no encontraba la propiedad icono
tuvimos que quitar de los archivos que teniamos icono

@if (producto.imagen) {
mostrar imagen
} @else {
mostrar icono
}
ya que siempre va a tener iamgen y no un simple icono

- <img [src]="producto.imagen" [alt]="producto.nombre" />

luego del formulario quitamos icono y dejamos imagen como objeto obligatorio, una vez terminado esto empezamos a mejorar la parte de imagen principal del formualruio de Nuevo producto
queremos permitir dos formas diferentes de añadir imagen

- seleccionarla desde el ordenador
- introducir una URL de una imagen

Si seleccionamos una imagen desde el ordenador utilizamos `FileReader`.

- const lector = new FileReader();

sto permite leer la imagen seleccionada y convertirla en un Data URL que podemos guardar dentro del campo `imagen` del formulario.

para saber como quedaria la imagen mostraremos con un signal, otra cosa es poder validar que solo se puedan selecionar png jpg webp y que no supere los 5mb

aparte podemos coger una url

- imagenPreview = signal<string | null>(null);

Por último añadimos `quitarImagenSeleccionada()`.

Simplemente sirve para que si estoy creando un producto y me equivoco de imagen pueda quitarla y seleccionar otra o utilizar una url

Asi terminamos eliminando completamente el antiguo sistema de iconos y ahora todos los productos trabajan solamente con imagenes.

## paso 51

En este paso hice que la descripción del producto dejase de estar hardcodeada primero añadi descripcion al FormGroup:

- descripcion: new FormControl('', {
  nonNullable: true,
  })

Despues conecte el textarea con Angular usando:

- formControlName="descripcion"

Así, cuando guardo un producto, getRawValue() recoge tambien la descripcion y se guarda en db.json.

Despues cambie el detalle del producto para mostrar:

- producto.descripcion

Como algunos productos antiguos todavia no tienen descripcion, deje un texto por defecto usando @if.

Con esto consegui que cada producto pueda tener su propia descripcion real desde que lo creo hasta que se muestra en la tienda.

Este encaja mucho mejor con el estilo que veníamos usando.

## paso 52

en este paso hice funcionar el estado de publicacion del prducto añadi un nuevo parametro en el formualrio

- publicado: new FormControl(true, {
  nonNullable: true,
  })

Le deje true por que normalmente cuando haces un nuevo producto es por que lo quieres publicar pero tambien pero muchas veces igual ese producto se va a poner al dia siguiente y entonces solo tendrias que el dia de mañna o x dias darle a visible y ya estqaria

luego cree el metodo alternarPublicacion y lo que hace es coger el valor actual dejarlo o si no ponerlo al contrario y lo conecte con el html

- [class.activo]="formularioProducto.controls.publicado.value"

lo utilice para que cambie segun el valor del formulario

## paso 54

en este paso hice funcionar la bsuiqueda rapiuda del inventario
cree un signal llamado busquedaAdmin para guardar lo que escribo
luego cree productosFiltrados con computed para filtrar los productos por nombre o identificador

## paso 55

Consegui el funcionamiento de filtro por categoria del inventario,añadi un signal categoriaAdmin para guardar la categoria selecionado,luego modifique el productosfiltrados() para que tenga en cuenta tanto la busqueda como la categoria

- (click)="categoriaAdmin.set(categoria)"

# paso 56

En este paso hice funcional el filtro por estado de stock del inventario.

Despues añadi este filtro dentro de productosFiltrados() junto con la busqueda y la categoria.

Tambien cre seleccionarEstadoStock() para poder seleccionar un estado y volver a odos si pulso otra vez sobre el mismo.

## Cómo arrancar el proyecto

\`\`\`bash
npm install
ng serve -o
\`\`\`
