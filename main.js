document.addEventListener('DOMContentLoaded', (event) => {
  let searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', filterDepartments);

  let populationCheckbox = document.getElementById('populationFilter');
  populationCheckbox.addEventListener('change', filterDepartments);

  // Añade un evento para cada radio button de las regiones
  for (let i = 1; i <= 6; i++) {
    let regionRadio = document.getElementById(`region-${i}`);
    if (regionRadio) {
      regionRadio.addEventListener('click', (e) => {
        // Si el radio button ya está seleccionado, des-seleccionarlo
        if (e.target.getAttribute('data-checked') === 'true') {
          e.target.checked = false;
          e.target.setAttribute('data-checked', 'false');
        } else {
          e.target.setAttribute('data-checked', 'true');
        }
        filterDepartments(); // Llama a la función de filtrado
      });
    }
  }
});

function filterDepartments() {
  let searchValue = document.getElementById('searchInput').value.toLowerCase();
  let populationFilter = document.getElementById('populationFilter').checked;
  let selectedRegion = document.querySelector('input[name="regionFilter"]:checked');
  let regionFilter = selectedRegion ? parseInt(selectedRegion.id.split('-')[1]) : null;
  let cajas = document.getElementById('cajas-departamentos').getElementsByClassName('caja');
  let resultsFound = false;

  for (let caja of cajas) {
    let title = caja.querySelector('.card-title').textContent.toLowerCase();
    let population = parseInt(caja.querySelector('.list-group-item').textContent.split(':')[1].trim().replace(' people', '').replace(/,/g, ''));
    let regionId = parseInt(caja.getAttribute('data-region-id'));

    let matchesSearch = title.includes(searchValue);
    let matchesPopulation = !populationFilter || population > 1000000;
    let matchesRegion = !regionFilter || regionId === regionFilter;

    if (matchesSearch && matchesPopulation && matchesRegion) {
      caja.style.display = "";
      resultsFound = true;
    } else {
      caja.style.display = "none";
    }
  }

  let noResultsDiv = document.getElementById('no-results-message');
  if (!resultsFound) {
    if (!noResultsDiv) {
      noResultsDiv = document.createElement('div');
      noResultsDiv.id = 'no-results-message';
      noResultsDiv.className = 'alert alert-warning';
      noResultsDiv.textContent = 'No se encontraron departamentos que coincidan con tu búsqueda.';
      document.getElementById('cajas-departamentos').appendChild(noResultsDiv);
    }
    noResultsDiv.style.display = "";
  } else if (noResultsDiv) {
    noResultsDiv.style.display = "none";
  }
}

// Llamada a la API para obtener información del país
let url = "https://api-colombia.com/api/v1/Country/Colombia";
fetch(url)
  .then(response => response.json())
  .then(data => {
    let lorem = document.getElementById("lorem");
    lorem.innerHTML = `
      <div class="card-body d-flex flex-column">
        <h1 class="card-title">${data.name}</h1>
        <p class="card-text container">${data.description}</p>
      </div>
      <div class="card-footer">
        <div class="row">
          <h5 class="col-3 col-md-4 col-sm-6">Population: ${data.population}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Area: ${data.surface} km<sup>2</sup> </h5>
          <h5 class="col-3 col-md-4 col-sm-6">Region: ${data.region}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Subregion: ${data.subRegion}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Capital: ${data.stateCapital}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Currency: ${data.currencySymbol} ${data.currency} ${data.currencyCode}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Languages: ${data.languages}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Timezone: ${data.timeZone}</h5>
          <h5 class="col-3 col-md-4 col-sm-6">Phone Prefix: ${data.phonePrefix}</h5>
        </div>
      </div>
      <small class="text-muted">Last updated 3 mins ago</small>
    `;
  })
  .catch(error => {
    console.error("Error al obtener los datos:", error);
  });

// Llamada a la API para obtener información de los departamentos
// Llamada a la API para obtener información de los departamentos
let departamentosUrl = "https://api-colombia.com/api/v1/Department";
fetch(departamentosUrl)
  .then(response => response.json())
  .then(data => {
    const sortedData = data.slice().sort((a, b) => a.id - b.id);
    let cajas = document.getElementById("cajas-departamentos");
    sortedData.forEach(departamento => {
      // Aquí haces la solicitud fetch para obtener el nombre de la capital
      const cityUrl = `https://api-colombia.com/api/v1/City/${departamento.cityCapitalId}`;
      fetch(cityUrl)
        .then(response => response.json())
        .then(city => {
          // Una vez que tienes el nombre de la ciudad, continúas creando la caja
          let caja = document.createElement("div");
          caja.className = "caja col-md-6 col-lg-3 py-3";
          caja.setAttribute('data-region-id', departamento.regionId);
          caja.innerHTML = `
            <div class="card h-100 mb-4" style="width: 18rem;">
              <img src="https://cdn.pixabay.com/photo/2018/07/31/06/33/flag-3574340_1280.png" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${departamento.name}</h5>
                <div class="custom-box">
                  <p class="card-text">${departamento.description}</p>
                </div>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Population: ${departamento.population} people</li>
                <li class="list-group-item">Area: ${departamento.surface} km<sup>2</sup></li>
                <li class="list-group-item">Phone Prefix: + ${departamento.phonePrefix}</li>
                <li class="list-group-item fw-bold">Capital: ${city.name}</li>
              </ul>
              <div class="card-body">
                <a href="./detalles.html?departamentoId=${departamento.id}" class="card-link">
                  <div class="btn btn-warning w-100">Detalles</div> 
                </a>
              </div>
            </div>
          `;
          cajas.appendChild(caja);
        })
        .catch(error => {
          console.error('Error al obtener el nombre de la capital:', error);
        });
    });
  })
  .catch(error => {
    console.error("Error al obtener los datos de los departamentos:", error);
  });


// JavaScript para mostrar/ocultar el header basado en la dirección del desplazamiento
let lastScrollTop = 0; // Variable para guardar la última posición de desplazamiento

window.addEventListener("scroll", function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    // Si el usuario está desplazándose hacia abajo, oculta el header
    document.querySelector("header").style.top = "-60px"; // Ajusta este valor al tamaño de tu header
  } else {
    // Si el usuario está desplazándose hacia arriba, muestra el header
    document.querySelector("header").style.top = "0";
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Actualiza la última posición de desplazamiento
}, false);
