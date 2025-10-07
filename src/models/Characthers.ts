class Characters {
  items: any[];
  meta: any;
  links: any;

  constructor(items: any[], meta: any, links: any) {
    this.items = items;
    this.meta = meta;
    this.links = links;
  }

  renderPersonajes(personajes: any[]) {
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
}
