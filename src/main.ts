import './style.css'
import { fromEvent, catchError, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';




const filtro = document.getElementById('race-filter') as HTMLSelectElement;
/*
if (filtro) {
  filtro.addEventListener('change', () => {
    const race: string = filtro.value;
    const url: string = `https://dragonball-api.com/api/characters?race=${race}`;
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('falla aqui');
        }
        return res.json();
      }).then(data => {
        if (data) {
          console.log(data);
        }
      }).catch(err => console.error(err));
  });
}
*/
if (filtro) {
  fromEvent(filtro, 'change').subscribe((async () => {
    const apiFiltrado = `https://dragonball-api.com/api/characters?race=${filtro.value}&affiliation=${filtroaf.value}`;

    const respuestaFiltrado = fromFetch(apiFiltrado).pipe(
      switchMap((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener filtrando por raza');
        }
        return response.json();
      }), catchError((err) => {
        console.error(err);
        return of({ error: true, message: err.message });
      })
    );

    respuestaFiltrado.subscribe({
      next: (response: any) => {
        const app = document.getElementById('app');
        if (app) {
          app.innerHTML = ``;
          (response as any[]).forEach(value => {
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
            console.log(response)
          }

        },
        complete: () => console.log("done"),
      });
    })
  )
}



//inicializar aplicacion cuando el DOM este listo
fromEvent(document, 'DOMContentLoaded').subscribe((async () => {
  const apiBola = 'https://dragonball-api.com/api';

  const respuestaApi = fromFetch(apiBola + "/characters?limit=100").pipe(
    switchMap((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener respuesta de la api');
      }
      console.log('estamos aqui');
      return response.json();
    }), catchError((err) => {
      console.error(err);
      return of({ error: true, message: err.message });
    })
  );




  respuestaApi.subscribe({
    next: (response: any) => {
      const app = document.getElementById('app');
      if (app) {
        (response['items'] as any[]).forEach(value => {
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
        console.log(response)
      }

    },
    complete: () => console.log("done"),
  });
  //salida :response{...}


}).bind(this));



