import { AuthService } from './auth-service.js';

export class LoginHandler {
    constructor() {
        this.authService = new AuthService();
    }

    init() {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(loginForm);
                const usuario = formData.get('usuario');
                const contraseña = formData.get('contraseña');

                if (this.authService.authenticate(usuario, contraseña)) {
                    // Hide error if visible
                    loginError.classList.add('hidden');
                    
                    // Trigger login success event
                    window.dispatchEvent(new CustomEvent('loginSuccess'));
                } else {
                    // Show error
                    loginError.classList.remove('hidden');
                }
            });
        }
    }
}