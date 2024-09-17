const API_URL = 'http://localhost/backend';

// Función para manejar el login
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

// Función para hacer peticiones autenticadas
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    return fetch(url, mergedOptions);
}

// Verifica si el usuario está logueado al cargar la página
window.onload = function() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '../peoplelist/index.html'; 
    }
};

// Manejar el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await login(email, password);
        document.getElementById('message').textContent = 'Login exitoso!';
        window.location.href = '../peoplelist/index.html';
    } catch (error) {
        document.getElementById('message').textContent = 'Error en el login. Por favor, intenta de nuevo.';
    }
});

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    // Redirige al formulario de login
    window.location.href = '../login/index.html'; 
}

// Verifica si hay una sesión activa en login
function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Si no existe el token, redirige al login
        window.location.href = '../login/index.html';
    } else {
        console.log('Usuario autenticado');
        window.location.href = '../peoplelist/index.html';
    }
}
