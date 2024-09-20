import { auth } from '../validations/auth.js';
import {initNavbar} from '../navbar/navbar.js';

const API_URL = 'https://localhost/backend';
const personList = document.getElementById('personList');

document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = '../index.html';
    } else {
        initializePage();
    }
});

async function initializePage() {
    initNavbar();
    await getPersonList();
    setupAddPersonButton();
}

async function getPersonList() {
    try {
        const response = await fetch(`${API_URL}/personas`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch person list');
        }
        const data = await response.json();
        renderPersonList(data);
    } catch (error) {
        console.error('Error al obtener el listado de personas:', error);
        alert('Error al cargar la lista de personas. Por favor, intente de nuevo más tarde.');
    }
}

function renderPersonList(people) {
    people.forEach(person => {
        const card = createPersonCard(person);
        personList.appendChild(card);
    });
}

function createPersonCard(person) {
    const card = document.createElement('div');
    card.classList.add('card');
    const imageUrl = person.image_path
        ? `${API_URL}${person.image_path}` : 'https://www.w3schools.com/howto/img_avatar.png';
    console.log(imageUrl);
    card.innerHTML = `
        <img src="imageUrl" class="icon" alt="Avatar" style="width:100%">
        <div class="container">
            <h4>${person.name} ${person.lastname}</h4>
            <p>${person.email}</p>
            <p>C.I: ${person.countryid}</p>
            <p>RUT: ${person.rut}</p>
            <button class="view-person" data-id="${person.id}">Ver</button>
        </div>
    `;

    card.querySelector('.view-person').addEventListener('click', () => {
        window.location.href = `../view_person/index.html?id=${person.id}`;
    });

    return card;
}

function setupAddPersonButton() {
    const addPersonButton = document.getElementById('addPerson');
    if (addPersonButton) {
        addPersonButton.addEventListener('click', () => {
            window.location.href = '../form/index.html';
        });
    }
}