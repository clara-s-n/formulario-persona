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

      console.log('La persona se ha cargado correctamente:', persona);
    } else {
      console.error('Error al obtener los datos de la persona');
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }

  document.getElementById('volverBtn').addEventListener('click', function() {
    window.location.href = 'http://localhost';
  });
}


// Elimina una persona según su id al presionar botón "Eliminar"

document.getElementById('eliminarBtn').addEventListener('click', async function () {
  console.log("Botón eliminar presionado");

  // Pregunta si realmente desea eliminarlo
  const confirmDelete = confirm("¿Seguro que desea eliminar esta persona?");
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
