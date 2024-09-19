import { auth } from "../validations/auth.js";
import { initNavbar } from "../navbar/navbar.js";

const API_URL = 'https://localhost/backend/personas';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const personId = getQueryParam('id');

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) {
    window.location.href = '../login/index.html';
  } else {
    
    if (personId) {
      initNavbar();
      fetchPersonData();
    } else {
      console.error('ID de persona no proporcionado');
      alert('Error: ID de persona no proporcionado');
      window.location.href = '/';
    }
  }

  document.getElementById('volverBtn').addEventListener('click', () => {
    window.location.href = '/peopleList';
  });

  document.getElementById('eliminarBtn').addEventListener('click', deletePerson);
  document.getElementById('editarBtn').addEventListener('click', editPerson);
});

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
      document.getElementById('countryId').innerText = persona.countryId;
      document.getElementById('rut').innerText = persona.rut;
    } else {
      handleFetchError(response);
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }
}


async function deletePerson() {
  const confirmDelete = confirm("¿Seguro que desea eliminar esta persona?");
  if (!confirmDelete) return;
  try {
    // Si el id de la persona no es el mismo que el del usuario autenticado, no permitir la eliminación
    const userId = auth.getId();
    console.log('User ID:', userId);
    console.log('Person ID:', personId);
    if (String(userId) !== String(personId)) {
      alert('No tienes permisos para eliminar esta persona');
      return;
    }


    const response = await fetch(`${API_URL}/${personId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (response.ok) {
      alert('Persona eliminada con éxito');

      // Eliminamos al token del local storage
      auth.logout();

      // Redirigimos al usuario a la página de login
      window.location.href = '/';
    } else {
      handleFetchError(response);
    }
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    alert('Error al eliminar la persona');
  }
}

async function editPerson(){
  const userId = auth.getId();
    console.log('User ID:', userId);
    console.log('Person ID:', personId);
    if (String(userId) !== String(personId)) {
      alert('No tienes permisos para editar esta persona');
      return;
    }
    window.location.href = `../editForm/index.html?id=${personId}`;
}

function handleFetchError(response) {
  if (response.status === 401) {
    alert('Sesión expirada. Por favor, vuelva a iniciar sesión.');
    auth.logout();
    window.location.href = '../login/index.html';
  } else if (response.status === 403) {
    alert('No tiene permiso para realizar esta acción.');
  } else {
    alert('Error al procesar la solicitud.');
  }
}