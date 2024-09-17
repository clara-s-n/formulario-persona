import { auth } from '../validations/auth.js';
import { initNavbar } from '../navbar/navbar.js';

// Inicializar la barra de navegación
initNavbar();

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.login(email, password);
        // Mostramos un mensaje de éxito al usuario
        window.alert('Login exitoso');
        // Las actualizaciones de la navbar se manejan en el evento authChanged
        const event = new Event('authChanged');
        document.dispatchEvent(event);
        window.location.href = '../peopleList/index.html';
    } catch (error) {
        console.error('Login failed:', error);
        window.alert('Login fallido: ' + error.message);
        window.location.reload();
    }
});

// Para el login con Google, esto hay que verlo
/*
document.getElementById('googleLoginButton').addEventListener('click', async () => {
    const googleToken = await getGoogleToken(); // Esta función hay que implementarla
    try {
        await auth.loginWithGoogle(googleToken);
        window.location.href = '/';
    } catch (error) {
        console.error('Google login failed:', error);
        // Muestra un mensaje de error al usuario
    }
});*/