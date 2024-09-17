import { validateField, setupFormValidation } from '../validations/fieldValidations.js';
import  Persona  from '../models/persona.js';
import {initNavbar} from "../navbar/navbar";

initNavbar()
const form = document.getElementById('registroForm');
const registrarBtn = document.getElementById('registrarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const listadoBtn = document.getElementById('listadoBtn');

// Set up form validation
setupFormValidation('registroForm');

// Function to use the cancel and list buttons
cancelarBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.reload();
});

listadoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '/';
});

// Logic for registering people
const API_URL = 'https://localhost/backend/personas';

// Modify the registration function to send data to the backend
registrarBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('input').forEach(input => {
        if (!validateField(input, form)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Create a person object with form data
        const persona = new Persona(
            form.name.value,
            form.lastname.value,
            form.email.value,
            form.countryId.value,
            form.rut.value,
            form.password.value,
            form.repeatPassword.value,
        );

        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(persona),
            });

            if (response.ok) {
                alert('Registro exitoso');
                window.location.href = '/';
            } else {
                alert('Error al registrar la persona');
            }
        } catch (error) {
            console.error('Error al registrar la persona:', error);
            alert('Error al registrar la persona');
        }
    } else {
    const firstInvalidInput = form.querySelector('.invalid');
    firstInvalidInput?.scrollIntoView({ behavior: 'smooth' });
    firstInvalidInput?.focus();
    }
});