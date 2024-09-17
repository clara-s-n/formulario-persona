import {auth} from "../validations/auth";

const API_URL = 'https://localhost/backend/personas';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const personId = getQueryParam('id');

if (!auth.isAuthenticated()) {
  window.location.href = '../login/index.html';
}
else {
  if (personId) {
    fetchPersonData();
  } else {
    console.error('ID de persona no proporcionado');
  }
}

async function fetchPersonData() {
  try {
    const response = await fetch(`${API_URL}/${personId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (response.ok) {
      const persona = await response.json();
      document.getElementById('name').innerText = persona.name;
      document.getElementById('lastname').innerText = persona.lastname;
      document.getElementById('email').innerText = persona.email;
      document.getElementById('countryId').innerText = persona.countryid;
      document.getElementById('rut').innerText = persona.rut;

      console.log('La persona se ha cargado correctamente:', persona);
    } else {
      console.error('Error al obtener los datos de la persona');
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }

  document.getElementById('volverBtn').addEventListener('click', function () {
    window.location.href = 'http://localhost';
  });
}


// Elimina una persona según su id al presionar botón "Eliminar"

document.getElementById('eliminarBtn').addEventListener('click', async function () {
  console.log("Botón eliminar presionado");

  // Pregunta si realmente desea eliminarlo
  const confirmDelete = confirm("¿Seguro que desea eliminar esta persona?");
  console.log('Alerta funciona correctamente');
  if (!confirmDelete) return;

  if (!personId) {
    console.error('ID de persona no proporcionado');
    return;
  }
  console.log('Eliminando persona con ID:', personId);

  try {
    const response = await fetch(`${API_URL}/${personId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Respuesta del servidor:', await response.text());

    if (response.ok) {
      alert('Persona eliminada con éxito');
      window.location.href = '/';
    } else {
      alert('Error al eliminar la persona');
    }
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    alert('Error al eliminar la persona');
  }
});

// Cuando hacemos click en editar, nos redirige a la página de edición
document.getElementById('editarBtn').addEventListener('click', function () {
  window.location.href = `../editForm/index.html?id=${personId}`;
});