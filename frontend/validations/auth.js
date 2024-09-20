// auth.js
const API_URL = 'https://localhost/backend';

export const auth = {
    id: localStorage.getItem('id'),
    token: localStorage.getItem('token'),
    user: (() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null; // Retorna null si no hay datos
        } catch {
            console.error("Error parsing user from localStorage");
            return null;
        }
    })(),

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                console.log('Contraseña recibida:', password, 'Contraseña esperada', );
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;
            this.id = data.id;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('id', this.id);

            return this.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async loginWithGoogle(googleInfo) {
        try {
            // Verificar si el token existe
            if (googleInfo) {
                // Extraer el token del parámetro 'token'
                const googleToken = googleInfo.get('token');
                // Almacenar el token en localStorage
                localStorage.setItem('token', googleToken);
                // Extraer el usuario del parametro 'user'
                const googleUser = {name: googleInfo.get('username'), lastname: googleInfo.get('userlastname')};
                // Almacenar el usuario en localStorage
                localStorage.setItem('user', JSON.stringify(googleUser));
            } else {
                // Manejar el caso en que no haya token en la URL
                console.error('Login con google no disponible');
            }
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        // Comparamos la fecha de expiración del token con la fecha actual
        const payload = this.getPayload();
        if (!payload) return false;
        const expirationTime = payload.exp * 1000;
        const isExpired = Date.now() >= expirationTime;
        if (!!this.token && !isExpired) {
            return true;
        }
        this.logout();
    },

    getUser() {
        return this.user;
    },

    getId(){
        const payload = this.getPayload();
        return payload ? payload.id : null;

    },
    async verifyToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (!response.ok) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token verification error:', error);
            this.logout();
            return false;
        }
    },

    getPayload() {
        if (!this.token) return null;
        const arrayToken = this.token.split('.') // Divide el token en 3 partes
        const payload = JSON.parse(atob(arrayToken[1])) // Decodifica la parte del payload
        return payload;
    }
};