const API_URL = 'http://localhost:3000';

const cancelarBtn = document.getElementById('cancelarBtn');
const confirmarBtn = document.getElementById('confirmarBtn');

cancelarBtn.addEventListener('click', function (e) {
    e.preventDefault();
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
    constructor(nombre, apellido, email, cedula, rut, password, repeatPassword) {
        this.id = personId;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.cedula = cedula;
        this.rut = rut;
        this.contraseña = password;
        this.repetirContraseña = repeatPassword;
    }
}

confirmarBtn.addEventListener('click', async function (e) {
    e.preventDefault();

        // Creamos un objeto persona con los datos del formulario
    const persona = new Persona(
            document.getElementById('nombre').value,
            document.getElementById('apellido').value,
            document.getElementById('email').value,
            document.getElementById('cedula').value,
            document.getElementById('rut').value,
            document.getElementById('password').value,
            document.getElementById('repeatPassword').value,
    );

    try {
        const response = await fetch(`${API_URL}/personas/${personId}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
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


/*                   COLOCAR EN VIEW_PERSON UNA VEZ TERMINADO

            <button class="edit-person" data-id="${person.id}">Editar</button>

            const editButton = card.querySelector('.edit-person');
            editButton.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                console.log(`Botón "Editar" clickeado, ID: ${id}`);
                window.location.href = `../editForm/index.html?id=${id}`;
            });
            
*/