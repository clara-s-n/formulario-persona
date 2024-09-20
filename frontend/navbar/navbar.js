import { auth } from '../validations/auth.js';

const navbarHTML = `
<nav class="navbar">
  <ul class="navbar-nav">
    <li class="nav-item" id="login-item">
      <a href="/" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" class="fa-primary" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
        </svg>
        <span class="link-text">Login</span>
      </a>
    </li>
    <li class="nav-item" id="people-list-item" style="display: none;">
      <a href="/peopleList" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path fill="currentColor" class="fa-primary" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
        </svg>
        <span class="link-text">Ver personas</span>
      </a>
    </li>
    <li class="nav-item" id="logout-item" style="display: none;">
      <a href="#" class="nav-link" id="logout-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" class="fa-primary" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/>
        </svg>
        <span class="link-text">Logout</span>
      </a>
    </li>
  </ul>
  <div id="user-info"></div> 
</nav>
`;

function updateNavbar() {
    const loginItem = document.getElementById('login-item');
    const peopleListItem = document.getElementById('people-list-item');
    const logoutItem = document.getElementById('logout-item');
    const userInfoElement = document.getElementById('user-info');

    if (!loginItem || !peopleListItem || !logoutItem || !userInfoElement) {
        console.error('One or more navbar items not found');
        return;
    }

    if (auth.isAuthenticated()) {
        loginItem.style.display = 'none';
        peopleListItem.style.display = 'block';
        logoutItem.style.display = 'block';
        const userInfo = auth.getUser();
        if (userInfo) {
            userInfoElement.textContent = `Usuario: ${userInfo.name} ${userInfo.lastname}`;
        }

        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                auth.logout();
                updateNavbar();
                window.location.href = '/';
            });
        }
    } else {
        loginItem.style.display = 'block';
        peopleListItem.style.display = 'none';
        logoutItem.style.display = 'none';
        userInfoElement.textContent = '';
    }
}

export function initNavbar() {
    const header = document.getElementById('header');
    if (header) {
        header.innerHTML = navbarHTML;
        updateNavbar();
    } else {
        console.error('Header element not found');
    }
}

// Escuchar eventos de cambio de autenticación
document.addEventListener('authChanged', updateNavbar);

// Exportar la función updateNavbar para su uso en otros archivos si es necesario
export { updateNavbar };