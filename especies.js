let url = "https://api-colombia.com/api/v1/InvasiveSpecie";

fetch(url)
  .then(response => response.json())
  .then(data => {

  data.forEach(especie => {
  let tablaEspecies = document.getElementById('especies');
  const fila = document.createElement('tr');
  fila.classList.add(`nivel-riesgo-${especie.riskLevel}`);
  
  fila.innerHTML = `
    
    <td>${especie.name}</td>
    <td>${especie.scientificName}</td>
    <td class="py-3">${especie.impact}</td>
    <td class="py-3">${especie.manage}</td>
    <td>${especie.riskLevel}</td>
    <td><img class="pe-1" src="${especie.urlImage}" alt="${especie.name}" height="50"></td>
    
  `;
  
  tablaEspecies.appendChild(fila);
});

  })
  .catch(error => {
    console.error("Error al obtener los datos:", error);
  })








  function especies() {
    let url = "hhttps://api-colombia.com/api/v1/InvasiveSpecie";
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const sortedData = data.slice().sort((a, b) => a.id - b.id);
        let especies = document.getElementById("especies");
        for (let i = 0; i < sortedData.length; i++) {
          let especie = sortedData[i];
          console.log(especie);
        }
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
      });
  }