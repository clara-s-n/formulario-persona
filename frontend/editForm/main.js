const API_URL = 'http://localhost:3000';

try {
    const response = await fetch(`${API_URL}/personas/:id`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(persona),
    });

    if (response.ok) {
        const persona = await response.json();
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('edad').value = persona.edad;
        document.getElementById('email').value = persona.email;
      } else {
        console.error('Error al obtener los datos de la persona');
      }
} catch (error) {
    console.error('Error al registrar la persona:', error);
    alert('Error al registrar la persona');
}
