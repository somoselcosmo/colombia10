// detalle.js
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const departamentoId = parseInt(urlParams.get('departamentoId'));
  if (departamentoId) {
    const departamentosUrl = `https://api-colombia.com/api/v1/Department/${departamentoId}`;
    const ciudadesUrl = `https://api-colombia.com/api/v1/Department/${departamentoId}/cities`;

    fetchDetallesDepartamento(departamentosUrl);
    fetchCiudades(ciudadesUrl);
    fetchAreasNaturales(departamentoId);
  } else {
    document.getElementById('detalle').innerHTML = 'No se ha proporcionado el ID del departamento.';
  }
  filterContent();
});

// Añade el eventListener al input de búsqueda
document.getElementById('searchInput').addEventListener('input', filterContent);

// Añade los eventListeners a los checkboxes
document.getElementById('ciudadesCheckbox').addEventListener('change', filterContent);
document.getElementById('areasNaturalesCheckbox').addEventListener('change', filterContent);

function filterContent() {
  
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  const showCiudades = document.getElementById('ciudadesCheckbox').checked;
  const showAreasNaturales = document.getElementById('areasNaturalesCheckbox').checked;

  // Filtra las ciudades
  const ciudadesDivs = document.querySelectorAll('#ciudades-row .col-3');
  ciudadesDivs.forEach(div => {
    const title = div.querySelector('.card-title').textContent.toLowerCase();
    const matchesSearch = searchText === '' || title.includes(searchText);
    div.style.display = matchesSearch && (showCiudades || !showAreasNaturales) ? '' : 'none';
  });

  // Filtra las áreas naturales
  const areasNaturalesDivs = document.querySelectorAll('#areas-naturales-row .col-3');
  areasNaturalesDivs.forEach(div => {
    const title = div.querySelector('.card-title').textContent.toLowerCase();
    const matchesSearch = searchText === '' || title.includes(searchText);
    div.style.display = matchesSearch && (showAreasNaturales || !showCiudades) ? '' : 'none';
  });

  // Si ambos filtros están desactivados, muestra todo
  if (!showCiudades && !showAreasNaturales) {
    ciudadesDivs.forEach(div => div.style.display = matchesSearch ? '' : 'none');
    areasNaturalesDivs.forEach(div => div.style.display = matchesSearch ? '' : 'none');
  }
  const ciudadesDivsVisible = Array.from(ciudadesDivs).some(div => div.style.display !== 'none');
  const areasNaturalesDivsVisible = Array.from(areasNaturalesDivs).some(div => div.style.display !== 'none');

  let noResultsMessage = document.getElementById('no-results-message');
  if (!noResultsMessage) {
    noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no-results-message';
    noResultsMessage.className = 'alert alert-warning';
    noResultsMessage.textContent = 'No se encontraron resultados que coincidan con tu búsqueda.';
    document.getElementById('detalle').appendChild(noResultsMessage);
  }
  noResultsMessage.style.display = (ciudadesDivsVisible || areasNaturalesDivsVisible) ? 'none' : 'block';

}

function fetchDetallesDepartamento(url) {
  fetch(url)
    .then(response => response.json())
    .then(departamento => {
      
      // Primero, obtén el nombre de la capital del departamento
      const cityUrl = `https://api-colombia.com/api/v1/City/${departamento.cityCapitalId}`;
      fetch(cityUrl)
        .then(response => response.json())
        .then(city => {
          // Ahora que tienes el nombre de la ciudad, actualiza el HTML
          const detalleDiv = document.getElementById('detalle');
          detalleDiv.innerHTML = `
            <h1>${departamento.name}</h1>
            <p class="lead mb-4 text-muted fw-bold container">${departamento.description}</p>
            <table class="table container">
              <tr class="table-secondary fw-bold">
                <td>Población</td>
                <td>Capital</td>
                <td>Superficie</td>
                <td>Municipios en total</td>
                <td>Región</td>
              </tr>
              <tr>
                <td>${departamento.population}</td>
                <td>${city.name}</td>
                <td>${departamento.surface} km<sup>2</sup></td>
                <td>${departamento.municipalities}</td>
                <td>${departamento.regionId}</td>
              </tr>
            </table>
          `;
        })
        .catch(error => {
          console.error('Error al obtener el nombre de la capital:', error);
        });
    })
    .catch(error => {
      console.error('Error al obtener los detalles del departamento:', error);
    });
    
}


function fetchCiudades(url) {
  fetch(url)
    .then(response => response.json())
    .then(ciudades => {
      // Procesa y muestra las ciudades del departamento
      const ciudadesDiv = document.getElementById('ciudades-row');
      ciudadesDiv.innerHTML = '<h4>Ciudades</h4>';
      ciudades.forEach(ciudad => {
        ciudadesDiv.innerHTML += `
          
          <div class="col-3">
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${ciudad.name}</h5>
                
                <div class="d-flex justify-content-between align-items-center">
                 <p> ${ciudad.description}
                 
                </div>
              </div>
            </div>
          </div>
        `;
      });

      ciudadesDiv.innerHTML += '</div>'; // Cierra el div de la fila
    })
    .catch(error => {
      console.error('Error al obtener las ciudades:', error);
    });
    filterContent();
}


function fetchAreasNaturales(departamentoId) {
  const depUrl = `https://api-colombia.com/api/v1/NaturalArea/${departamentoId}`;

  fetch(depUrl)
    .then(response => response.json())
    .then(area => {
      const areasNaturalesDiv = document.getElementById('areas-naturales-row');
      // Verifica si el objeto tiene la propiedad 'name'
      if (area && area.name) {
        areasNaturalesDiv.innerHTML = '<h4>Áreas Naturales</h4><div class="row">';
        // Crea la tarjeta para la única área natural
        areasNaturalesDiv.innerHTML += `
          <div class="col-3">
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${area.name}</h5>
                <p class="card-text">${area.categoryNaturalArea.description}</p>
                <!-- Agrega más detalles que desees mostrar -->
              </div>
            </div>
          </div>
        `;
        areasNaturalesDiv.innerHTML += '</div>'; // Cierra el div de la fila
      } else {
        // Si el objeto no tiene la propiedad 'name', muestra un mensaje
        areasNaturalesDiv.innerHTML = 'No se encontró información de áreas naturales para este departamento.';
      }
    })
    .catch(error => {
      console.error('Error al obtener las áreas naturales:', error);
    });
    filterContent();
}

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

