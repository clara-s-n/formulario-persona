const API_URL = 'http://localhost:3000';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const personId = getQueryParam('id');

if (personId) {
  try {
    const response = await fetch(`${API_URL}/personas/${personId}`, {
       method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(persona),
    });

    if (response.ok) {
      const persona = await response.json();
      document.getElementById('nombre').value = persona.nombre;
      document.getElementById('apellido').value = persona.apellido;
      document.getElementById('edad').value = persona.edad;
      document.getElementById('email').value = persona.email;
      document.getElementById('rut').value = persona.rut;
    } else {
      console.error('Error al obtener los datos de la persona');
    }
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
    alert('Error al obtener los datos de la persona');
  }
} else {
  console.error('ID de persona no proporcionado');
}
