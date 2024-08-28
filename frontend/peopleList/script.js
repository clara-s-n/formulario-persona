const API_URL = 'http://localhost:3000';
const personList = document.getElementById('personList');

async function getPersonList() {
    try {
        const response = await fetch(`${API_URL}/personas`);
        const data = await response.json();
        personList.innerHTML = '';
        data.forEach(person => {
            const card = document.createElement('div');
            card.classList.add('card')
            card.innerHTML = `
                <img src="https://i.fbcd.co/products/resized/resized-750-500/d4c961732ba6ec52c0bbde63c9cb9e5dd6593826ee788080599f68920224e27d.jpg" class="icon" alt="Avatar" style="width:100%">
                <div class="container">
                    <h4>${person.nombre} ${person.apellido}</h4>
                    <p>${person.email}</p>
                    <p>C.I: ${person.cedula}</p>
                    <p>RUT: ${person.rut}</p>
                </div>
            `;
            personList.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener el listado de personas:', error);
    }
}

// Cargar el listado inicial
getPersonList();