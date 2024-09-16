import Persona from "../models/persona.js";
import { validateField, setupFormValidation } from '../validations/fieldValidations.js';

const API_URL = 'https://localhost/backend';

const cancelarBtn = document.getElementById('cancelarBtn');
const confirmarBtn = document.getElementById('confirmarBtn');

cancelarBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.alert('Los datos no se han guardado');
    window.location.href = '/';
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const personId = getQueryParam('id');

if (personId) {
    obtenerDatosPersona().then(() => console.log('Datos de persona obtenidos'));
} else {
    console.error('ID de persona no proporcionado');
}

const form = document.getElementById('editForm');
const inputs = form.querySelectorAll('input');

// Lógica para validar los campos del formulario
setupFormValidation('editForm');

confirmarBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    let isValid = true;

    form.querySelectorAll('input').forEach(input => {
        if (!validateField(input, form)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Creamos un objeto persona con los datos del formulario
        const persona = new Persona(
            document.getElementById('name').value,
            document.getElementById('lastname').value,
            document.getElementById('email').value,
            document.getElementById('countryId').value,
            document.getElementById('rut').value,
            document.getElementById('password').value,
            document.getElementById('repeatPassword').value,
        );

        try {
            const response = await fetch(`${API_URL}/personas/${personId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(persona)
            });

            if (response.ok) {
                alert('Edicion exitosa');
                window.location.href = '/';
            } else {
                alert('Error al editar la persona');
            }
        } catch (error) {
            console.error('Error al editar la persona:', error);
            alert('Error al editar la persona');
        }
    }else {
        const firstInvalidInput = form.querySelector('.invalid');
        firstInvalidInput?.scrollIntoView({ behavior: 'smooth' });
        firstInvalidInput?.focus();
    }
}
);

async function obtenerDatosPersona() {
    try {
        const response = await fetch(`${API_URL}/personas/${personId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const persona = await response.json();
            document.getElementById('name').value = persona.name;
            document.getElementById('lastname').value = persona.lastname;
            document.getElementById('email').value = persona.email;
            document.getElementById('countryId').value = persona.countryid;
            document.getElementById('rut').value = persona.rut;
        } else {
            console.error('Error al obtener los datos de la persona');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}