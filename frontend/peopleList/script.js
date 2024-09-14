const API_URL = 'http://localhost/backend';
const personList = document.getElementById('personList');

async function getPersonList() {
    console.log('Iniciando getPersonList()');
    try {
        console.log('Haciendo fetch a:', `${API_URL}/personas`);
        const response = await fetch(`${API_URL}/personas`);
        const data = await response.json();
        console.log('Datos recibidos:', data);

        console.log('Creando tarjeta de "Agregar Persona"');
        const addPersonCard = document.getElementById('add-person-card');

        const addPersonButton = addPersonCard.querySelector('#addPerson');
        addPersonButton.addEventListener('click', () => {
            console.log('Botón "Agregar Persona" clickeado');
            window.location.href = '../index.html';
        });

        console.log('Creando tarjetas de personas');
        data.forEach(person => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="https://i.fbcd.co/products/resized/resized-750-500/d4c961732ba6ec52c0bbde63c9cb9e5dd6593826ee788080599f68920224e27d.jpg" class="icon" alt="Avatar" style="width:100%">
                <div class="container">
                    <h4>${person.name} ${person.lastname}</h4>
                    <p>${person.email}</p>
                    <p>C.I: ${person.countryid}</p>
                    <p>RUT: ${person.rut}</p>
                    <button class="view-person" data-id="${person.id}">Ver</button>
                </div>
            `;

            const viewButton = card.querySelector('.view-person');
            viewButton.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                console.log(`Botón "Ver" clickeado, ID: ${id}`);
                window.location.href = `../view_person/index.html?id=${id}`;
            });


            personList.appendChild(card);
        });

        console.log('Proceso completado');

    } catch (error) {
        console.error('Error al obtener el listado de personas:', error);
    }
}

console.log('Script cargado, llamando a getPersonList()');
getPersonList();
