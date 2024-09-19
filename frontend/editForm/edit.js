import Persona from "../models/persona.js";
import { validateField, setupFormValidation } from '../validations/fieldValidations.js';
import { auth } from '../validations/auth.js';
import {initNavbar} from "../navbar/navbar";

const API_URL = 'https://localhost/backend';

document.addEventListener('DOMContentLoaded', () => {
    const cancelarBtn = document.getElementById('cancelarBtn');
    const confirmarBtn = document.getElementById('confirmarBtn');
    const form = document.getElementById('editForm');

    const personId = getQueryParam('id');

    if (personId) {
        initNavbar();
        obtenerDatosPersona();
    } else {
        console.error('ID de persona no proporcionado');
        alert('Error: ID de persona no proporcionado');
        window.location.href = '/';
    }

    setupFormValidation('editForm');
    displayUserInfo();

    cancelarBtn.addEventListener('click', handleCancel);
    confirmarBtn.addEventListener('click', handleConfirm);
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayUserInfo() {
    const userInfo = auth.getUser();
    if (userInfo) {
        const userInfoElement = document.createElement('div');
        userInfoElement.textContent = `Usuario: ${userInfo.name} ${userInfo.lastname}`;
        userInfoElement.classList.add('text-sm', 'text-gray-600', 'mb-4');
        document.querySelector('.container').prepend(userInfoElement);
    }
}

function handleCancel(e) {
    e.preventDefault();
    if (confirm('Los datos no se han guardado. ¿Está seguro que desea cancelar?')) {
        window.location.href = '/';
    }
}

async function handleConfirm(e) {
    e.preventDefault();
    const form = document.getElementById('editForm');

    if (validateForm(form)) {
        const persona = createPersonaFromForm();
        await updatePersona(persona);
        await doPost(e);
    }
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input').forEach(input => {
        if (!validateField(input, form)) {
            isValid = false;
        }
    });

    if (!isValid) {
        const firstInvalidInput = form.querySelector('.invalid');
        firstInvalidInput?.scrollIntoView({ behavior: 'smooth' });
        firstInvalidInput?.focus();
    }

    return isValid;
}

function createPersonaFromForm() {
    return new Persona(
        document.getElementById('name').value,
        document.getElementById('lastname').value,
        document.getElementById('email').value,
        document.getElementById('countryId').value,
        document.getElementById('rut').value,
        document.getElementById('password').value,
        document.getElementById('repeatPassword').value,
    );
}

async function updatePersona(persona) {
    const personId = getQueryParam('id');
    try {
        const response = await fetch(`${API_URL}/personas/${personId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
            },
            body: JSON.stringify(persona)
        });

        if (response.ok) {
            alert('Edición exitosa');
            window.location.href = '/';
        } else {
            handleFetchError(response);
        }
    } catch (error) {
        console.error('Error al editar la persona:', error);
        alert('Error al editar la persona');
    }
}

async function obtenerDatosPersona() {
    const personId = getQueryParam('id');
    try {
        const response = await fetch(`${API_URL}/personas/${personId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (response.ok) {
            const persona = await response.json();
            if (persona.id !== auth.getUser().id) {
                alert('No tienes permisos para editar esta persona');
                window.location.href = '/';
                return;
            }
            populateForm(persona);
        } else {
            handleFetchError(response);
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}

async function doPost(event) {
    event.preventDefault();
    console.log("doPost ejecutado");
    const form = document.getElementById("editForm");
    const formData = new FormData(form);
    console.log({ formData });

    try {
      const response = await fetch("backend/post/multipart", {
        method: "POST",
        // headers: {
        //   ContentType: "multipart/form-data",
        // },
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        console.info(result);
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
}

function populateForm(persona) {
    document.getElementById('name').value = persona.name;
    document.getElementById('lastname').value = persona.lastname;
    document.getElementById('email').value = persona.email;
    document.getElementById('countryId').value = persona.countryid;
    document.getElementById('rut').value = persona.rut;
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