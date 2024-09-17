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
        window.location.href = '/.html';  // hay que cambiar la ruta para las personas permitidas
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
        // Aquí podrías redirigir al usuario a una página protegida
    } catch (error) {
        document.getElementById('message').textContent = 'Error en el login. Por favor, intenta de nuevo.';
    }
});
