import Persona from "../models/persona.js";
import { validateField, setupFormValidation } from '../validations/fieldValidations.js';
import { auth } from '../validations/auth.js';
import {initNavbar} from "../navbar/navbar.js";

const API_URL = 'https://localhost/backend';

document.addEventListener('DOMContentLoaded', () => {
    const cancelarBtn = document.getElementById('cancelarBtn');
    const confirmarBtn = document.getElementById('confirmarBtn');

    const personId = getQueryParam('id');

    const userId = String(auth.getId());

    if (personId === userId) {
        initNavbar();
        obtenerDatosPersona();
    } else {
        console.error('No tienes permisos para editar a esta persona');
        alert('No tienes permisos para editar a esta persona');
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
    const userInfo = auth.getUser();    if (userInfo) {
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
    const persona = new Persona(
        document.getElementById('name').value,
        document.getElementById('lastname').value,
        document.getElementById('email').value,
        document.getElementById('countryId').value,
        document.getElementById('rut').value
    );
    return persona;
}

async function updatePersona(persona) {
    const personId=String(auth.getId());
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
            populateForm(persona);
        } else {
            handleFetchError(response);
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}

function populateForm(persona) {
    document.getElementById('name').value = persona.name;
    document.getElementById('lastname').value = persona.lastname;
    document.getElementById('email').value = persona.email;
    document.getElementById('countryId').value = persona.countryId;
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