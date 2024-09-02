const API_URL = 'http://localhost:3000/personas';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const personId = getQueryParam('id');

if (personId) {
  fetchPersonData();
} else {
  console.error('ID de persona no proporcionado');
}

async function fetchPersonData() {
  try {
    const response = await fetch(`${API_URL}/${personId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const persona = await response.json();
      document.getElementById('nombre').innerText = persona.nombre;
      document.getElementById('apellido').innerText = persona.apellido;
      document.getElementById('email').innerText = persona.email;
      document.getElementById('cedula').innerText = persona.cedula;
      document.getElementById('rut').innerText = persona.rut;
    } else {
      console.error('Error al obtener los datos de la persona');
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }
}