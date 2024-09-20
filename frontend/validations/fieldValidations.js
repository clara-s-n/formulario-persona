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
        const passwordError = validations.password(value);
        if (passwordError) return passwordError;
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
    },
    foto: (value) => {
        if (!value) return 'Debe seleccionar una imagen';
        if (!validImageTypes.includes(value.type)) return 'El tipo de archivo no es una imagen válida';
        if (value.size > 10 * 1024 * 1024) return 'La imagen no puede pesar más de 10MB';
        if (value.length > 1) return 'Solo puede subir una imagen';
        return '';
    }

};

function validateField(field, form) {
    const errorElement = document.getElementById(`${field.id}Error`);
    let error;

    if (validations[field.id]) {
        error = validations[field.id](field.value, form.password?.value);
    } else {
        // Acá validamos la imagen, porque por alguna razón no se puede hacer con el objeto file
        error = validations.foto(field.value);
    }

    errorElement.textContent = error;
    field.classList.toggle('valid', !error);
    field.classList.toggle('invalid', !!error);
    return !error;
}


function setupFormValidation(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.type === 'file') {
            input.addEventListener('change', function() {
                console.log('file change');
                console.log(this.id);
                validateField(this, form);
            });
        }

        input.addEventListener('input', function() {
            validateField(this, form);
        });
    });
}

const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

export { setupFormValidation, validateField };