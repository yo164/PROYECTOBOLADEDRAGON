import './style.css'
import { fromEvent, catchError, of, switchMap, map, filter } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';


//const filtroaf = document.getElementById('affiliation-filter') as HTMLSelectElement;
/*

*/
//filtra para raza o todos los personajes a la vez

//no filtra bien creo que primero tengo que meter el filtro de todos o d alguno entonces luego coprobar que si alguno solo uno viene vacio
//componer la url de se filtro mas el valor y si viene de los dos acumular de algua manera en una variable montar la url con los dos filtros


//ELEMENTOS DEL DOM
const botonPla = document.getElementById('planets');
//boton que nos muestra todos los planetas
if (botonPla) {
  fromEvent(botonPla, 'click').pipe(
    switchMap(() => obtenerPlanetas('https://dragonball-api.com/api/planets?limit=100'))
  ).subscribe(renderPlanetas);
}




//OBTENER PARAMETROS DE LOS FILTROS PARA PERSONAJES
const filtro = document.querySelectorAll<HTMLSelectElement>('select');
if (filtro) {
  let url = '';

  filtro.forEach((filtrado) => {
    fromEvent(filtrado, 'change').pipe(
      switchMap(() => {

        if ((filtrado.id === 'race-filter' || filtrado.id === 'affiliation-filter') && filtrado.value === '') {
          url = 'https://dragonball-api.com/api/characters?limit=100'
        } else if(filtrado.id === 'race-filter' && filtrado.value !== '') {
          url = `https://dragonball-api.com/api/characters?race=${filtrado.value}`
        }else if(filtrado.id === 'affiliation-filter' && filtrado.value !== ''){
          url = `https://dragonball-api.com/api/characters?affiliation=${filtrado.value}`;
        } 
        

        return obtenerPersonajes(url);
      })
    ).subscribe(renderPersonajes)
  });
   
}

//inicializar aplicacion cuando el DOM este listo
fromEvent(document, 'DOMContentLoaded').pipe(
  switchMap(() => obtenerPersonajes('https://dragonball-api.com/api/characters?limit=100')) 
).subscribe(renderPersonajes);


//ACTIVA LOS ANCHOR PARA VISITAR PLANETAS
function conectarEventosVisitar() {
  const botones = document.querySelectorAll<HTMLAnchorElement>('.botonVisitar');

  botones.forEach((boton) => {
    fromEvent(boton, 'click').pipe(
      switchMap((event) => {
        event.preventDefault();
        const id = boton.getAttribute('data-id');
        if(!id) throw new Error('id no encontrado');
        return obtenerPlanetaPorId(parseInt(id));
      })
    ).subscribe(renderPlaneta);
  }),
  catchError((err) => {
    console.error(err);
    return of([]);
  })
  
}

//FUNCIONES PARA OBTENER PERSONAJES Y PLANETAS
//PERSONAJES 
function obtenerPersonajes(url: string) {
  return fromFetch(url).pipe(
    switchMap((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener respuesta de la api');
      }
      return response.json();
    }),
    map((data) => {
      if ('items' in data) {
        return data.items;
      }
      return data;
    }), 
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  )
  
}
//PLANETAS
function obtenerPlanetas(url: string) {
  return fromFetch(url).pipe(
    switchMap((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener los planetas de la api');
        
      }
      return response.json();
    }),
    map((data) => {
      if('items' in data){
        return data.items;
      }
      return data;
    }),
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  )
}
//PLANETAS POR ID
function obtenerPlanetaPorId(id : number) {
  return fromFetch('https://dragonball-api.com/api/planets/' + id).pipe(
    switchMap((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener planetas por id');
      }
      return response.json();
    })
  )
}






//RENDER DE PERSONAJES Y PLANETAS
//PERSONAJES 
function renderPersonajes(personajes: any[]) {
  const app = document.getElementById('app');
      if (app) {
        app.innerHTML = ``;
        personajes.forEach(value => {
          app.innerHTML += `
            <div class="card">
              <div class="image-container">
                 <img src="${value['image']}" alt="${value['name']}"/>
              </div>
              <div class="data-container">
                <h2>${value['name']}</h2>
                <h3>Ki: ${value['ki']}</h3>
              </div>
            </div>\n
          `;
        });
        console.log(personajes)
      }
}

//PLANETAS 
function renderPlanetas(planetas: any[]){
   const app = document.getElementById('app');
      if (app) {
        app.innerHTML = ``;
        planetas.forEach(value => {
          app.innerHTML += `
          
            <div class="planetCard">
              <div class="image-container">
                 <img src="${value['image']}" alt="${value['name']}"/>
              </div>
              <div class="data-container">
                <h2>${value['name']}</h2>
                <h3>Exists: ${!value['isDestroyed']}</h3>
                <a class="botonVisitar" href="#" data-id="${value['id']}">Visitar </a>
              </div>
            </div>\n
          `;
        });
        console.log(planetas)
        //CARGA EL ADDEVENTLISTENER DE LOS ANCHOR
        conectarEventosVisitar();
      }
}

//PLANETA 
function renderPlaneta(planeta: any){
   const app = document.getElementById('app');
      if (app) {
        app.innerHTML = ``;
        
        const charactersFromPlanet  = planeta.characters;
        if (!charactersFromPlanet) {
          throw new Error('no hay hbitantes en este planeta');
        }
        const listaPersonajes = charactersFromPlanet
        .map((personaje: any) => `<li>${personaje.name}</li>`)
        .join('');
          app.innerHTML += `
            <div class="planetPage">
              <div class="image-container">
                 <img src="${planeta.image}" alt="${planeta.name}"/>
              </div>
              <div class="data-container">
                <h2>${planeta.name}</h2>
                <h3>Exists: ${!planeta.isDestroyed}</h3>
                <h4>Descripción</h4>
                <p>${planeta.description}</p>
              </div>
              <div class="charactersFromPlanet">
              <ul>
                ${listaPersonajes}
              </ul>
              </div>
            </div>\n
          `;
        
        console.log(planeta)
      }
}
  //salida :response{...}



/*

switchMap(() => fromFetch('api'))
switchMap(response => response.jso()),
tap(data => {
  const app document.querySelector<HTMLDivElement>('#app')
  app.innerHTML= `
  h1 dragon ball characters
  ul
  ${data['items'].map(char: any) =<li><img src=${data['img']}}
  ul
  `
})
  */






//Ejemplos de observables Juanantonio

console.log('estos son observables de los apuntes para probar cosas');
const miObservable = new Observable<number>((subscriber) => {
  //emitir valores 
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);


  //finalizar la emision 
  subscriber.complete();
});

//Para escuchar los valores que emite el Observable, se neceitas suscribirse
miObservable.subscribe({
  next: (valor)  => console.log('Valor recibido:', valor),
  error: (err) => console.error(err),
  complete: () => console.log('Finalizado')
});
console.log('cambiamos de observable');
const numeros$ = of(1, 2, 3, 4, 5);

const transformado$ = numeros$.pipe(
  map((valor) => valor * 10),//de cada valor lo multiplica por 10
  filter((valor) => valor > 20)//deja pasar solo los mayores a 20
);

//nos suscribimos al observable transformado
transformado$.subscribe({
  next:(valor) => console.log('Valor transformado' , valor),
  complete: () => console.log('Proceso completado')
})

//observables con async//await
console.log('Ahora cambiamos a Observables con async/await');

async function manejarObservable() {
  //convertir observable en promesa(nos sale deprcated hay que investigar)
  const valor = await of(42).toPromise();

  console.log('Valor obtenido con async/await:', valor);
  
  
}

manejarObservable();
console.log('ahora vamos a ejemplo con interval');
//Observable que emite un número cada segundo
const intervalo$ = interval(1000).pipe(
  take(5)//limitar la emision a 5 valores

);

//suscripcion al obsrevable
intervalo$.subscribe({
  next: (valor) => console.log('Intervalo emitido', valor), 
  complete: () => console.log('Intervalo completado')
});

//ahora un Observable con un evento de click
// probaremos otro pequeño con change para ir metiendole
//a la practica de dragon ball

console.log('Ahora vamos a hacer un Observable con evento de click');
//creamos el observable que emite eventos de click en un botón
const boton = document.getElementById('miBoton');
const click$ = fromEvent(boton!, 'click').pipe(
  map(() => 'boton cliqueado')
);

//ahora nos suscribimos para recibir las notificaciones de clicks

click$.subscribe({
  next: (mensaje) => console.log(mensaje)
});