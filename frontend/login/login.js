import { auth } from '../validations/auth.js';
import { initNavbar } from '../navbar/navbar.js';

// Inicializar la barra de navegación
initNavbar();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const googleLoginButton = document.getElementById('googleLoginButton');

    loginForm.addEventListener('submit', handleLogin);
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', handleGoogleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.login(email, password);
        handleSuccessfulLogin();
    } catch (error) {
        handleLoginError(error);
    }
}

async function handleGoogleLogin() {
    try {
        const googleToken = await getGoogleToken();
        if (googleToken) {
            await auth.loginWithGoogle(googleToken);
            handleSuccessfulLogin();
        } else {
            console.error('No se encontró el token en la URL');
        }
    } catch (error) {
        handleLoginError(error);
    }
}
function handleSuccessfulLogin() {
    window.alert('Login exitoso');
    document.dispatchEvent(new Event('authChanged'));
    window.location.href = '../peopleList/index.html';
}

function handleLoginError(error) {
    console.error('Login failed:', error);
    window.alert('Login fallido: ' + error.message);
}

// Implementar esta función para obtener el token de Google
async function getGoogleToken() {   
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    // Extraer el token del parámetro 'token'
    const token = urlParams.get('token');

    return token;
}

window.onload = handleGoogleLogin;