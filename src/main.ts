import './style.css'
import { fromEvent, catchError, of, switchMap, map, filter } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';






const filtro = document.querySelectorAll<HTMLSelectElement>('select');

//const filtroaf = document.getElementById('affiliation-filter') as HTMLSelectElement;
/*

*/
//filtra para raza o todos los personajes a la vez

if (filtro) {
  let url = '';

  filtro.forEach((filtrado) => {
    fromEvent(filtrado, 'change').pipe(
      switchMap(() => {
        if (filtrado.id === 'race-filter' && filtrado.value !== '') {
          url = `https://dragonball-api.com/api/characters?race=${filtrado.value}`;
        }else if (filtrado.id === 'affiliation-filter' && filtrado.value !== '' ) {
          url = `https://dragonball-api.com/api/characters?affiliation=${filtrado.value}`;
        }else{
          url = 'https://dragonball-api.com/api/characters?limit=100'
        }
        return obtenerPersonajes(url);
      })
    ).subscribe(renderPersonajes)
  });
   
}//no filtra bien creo que primero tengo que meter el filtro de todos o d alguno entonces luego coprobar que si alguno solo uno viene vacio
//componer la url de se filtro mas el valor y si viene de los dos acumular de algua manera en una variable montar la url con los dos filtros



//inicializar aplicacion cuando el DOM este listo
fromEvent(document, 'DOMContentLoaded').pipe(
  switchMap(() => obtenerPersonajes('https://dragonball-api.com/api/characters?limit=100')) 
).subscribe(renderPersonajes);

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
        return data.items
      }
      return data;
    }), 
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  )
  
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