const API_URL = 'http://localhost:3000';

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
    obtenerDatosPersona();
} else {
    console.error('ID de persona no proporcionado');
}

class Persona {
    constructor(name, lastname, email, countryId, rut, password, repeatPassword) {
        this.id = personId;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.countryId = countryId;
        this.rut = rut;
        this.password = password;
        this.repeatPassword = repeatPassword;
    }
}

const form = document.getElementById('editForm');
const inputs = form.querySelectorAll('input');

// Lógica para validar los campos del formulario
const validations = {
    name: (value) => {
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.length > 50) return 'El nombre no puede tener más de 50 caracteres';
        return '';
    },
    lastname: (value) => {
        if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
        if (value.length > 50) return 'El apellido no puede tener más de 50 caracteres';
        return '';
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(value) ? '' : 'El correo electrónico no es válido';
    },
    password: (value) => {
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (value.length > 20) return 'La contraseña no puede tener más de 20 caracteres';
        if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número';
        if (!/[!@#$%^&*_-]/.test(value)) return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*_-)';
        return '';
    },
    repeatPassword: (value, password) => {
        // Las mismas validaciones que en contraseña, más la de que sea igual a la contraseña
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (value.length > 20) return 'La contraseña no puede tener más de 20 caracteres';
        if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número';
        if (!/[!@#$%^&*_-]/.test(value)) return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*_-)';
        if (value !== password) return 'Las contraseñas no coinciden';
        return '';
    },
    countryId: (value) => {
        if (!isValidFormatId(value)) return 'El formato de la cédula no es válido';
        return isValidId(value) ? '' : 'La cédula no es válida';

    },
    rut: (value) => {
        if (!isValidFormat(value)) return 'El formato del RUT no es válido';
        return isValidRut(value) ? '' : 'El RUT no es válido';
    }
};
inputs.forEach(input => {
    input.addEventListener('input', function () {
        validateField(this);
    });
});

function validateField(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    let error = validations[field.id](field.value, form.password.value);
    errorElement.textContent = error;
    field.classList.toggle('valid', !error);
    field.classList.toggle('invalid', !!error);
    return !error;
}

confirmarBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
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
            document.getElementById('countryId').value = persona.countryId;
            document.getElementById('rut').value = persona.rut;
        } else {
            console.error('Error al obtener los datos de la persona');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}