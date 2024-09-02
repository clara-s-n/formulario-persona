const API_URL = 'http://localhost:3000';


const cancelarBtn = document.getElementById('cancelarBtn');

cancelarBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '/';
});

async function obtenerDatosPersona(id) {
    try {
        const response = await fetch(`${API_URL}/personas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const persona = await response.json();
            document.getElementById('nombre').value = persona.nombre;
            document.getElementById('apellido').value = persona.apellido;
            document.getElementById('email').value = persona.email;
            document.getElementById('cedula').value = persona.cedula;
            document.getElementById('rut').value = persona.rut;
        } else {
            console.error('Error al obtener los datos de la persona');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la persona:', error);
        alert('Error al obtener los datos de la persona');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 2];
    obtenerDatosPersona(id);
});