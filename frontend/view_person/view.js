import { auth } from "../validations/auth";
import { initNavbar } from "../navbar/navbar";

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

  displayUserInfo();

  document.getElementById('volverBtn').addEventListener('click', () => {
    window.location.href = '/';
  });

  document.getElementById('eliminarBtn').addEventListener('click', deletePerson);
  document.getElementById('editarBtn').addEventListener('click', () => {
    window.location.href = `../editForm/index.html?id=${personId}`;
  });
});

function displayUserInfo() {
  const userInfo = auth.getUser();
  if (userInfo) {
    const userInfoElement = document.createElement('div');
    userInfoElement.textContent = `Usuario: ${userInfo.name} ${userInfo.lastname}`;
    userInfoElement.classList.add('text-sm', 'text-gray-600', 'mb-4');
    document.querySelector('.container').prepend(userInfoElement);
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
      displayPersonData(persona);
    } else {
      handleFetchError(response);
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }
}

function displayPersonData(persona) {
  document.getElementById('name').textContent = persona.name;
  document.getElementById('lastname').textContent = persona.lastname;
  document.getElementById('email').textContent = persona.email;
  document.getElementById('countryId').textContent = persona.countryid;
  document.getElementById('rut').textContent = persona.rut;

  // Disable edit and delete buttons if the user is not the owner
  const currentUser = auth.getUser();
  if (currentUser.id !== persona.id) {
    document.getElementById('editarBtn').disabled = true;
    document.getElementById('eliminarBtn').disabled = true;
    document.getElementById('editarBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('eliminarBtn').classList.add('opacity-50', 'cursor-not-allowed');
  }
}

async function deletePerson() {
  const confirmDelete = confirm("¿Seguro que desea eliminar esta persona?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${personId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (response.ok) {
      alert('Persona eliminada con éxito');
      window.location.href = '/';
    } else {
      handleFetchError(response);
    }
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    alert('Error al eliminar la persona');
  }
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