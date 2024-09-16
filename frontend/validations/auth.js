// auth.js
const API_URL = 'https://localhost/backend';

export const auth = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return this.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async loginWithGoogle(googleToken) {
        try {
            const response = await fetch(`${API_URL}/auth/login/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleToken })
            });

            if (!response.ok) {
                throw new Error('Google login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return this.user;
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
        return !!this.token;
    },

    getUser() {
        return this.user;
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
    }
};