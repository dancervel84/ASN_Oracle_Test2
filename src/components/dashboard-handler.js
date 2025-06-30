import { AuthService } from './auth-service.js';

export class DashboardHandler {
    constructor() {
        this.authService = new AuthService();
    }

    init() {
        const logoutBtn = document.getElementById('logout-btn');
        const navBtns = document.querySelectorAll('.nav-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authService.logout();
                window.dispatchEvent(new CustomEvent('logout'));
            });
        }

        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const module = e.target.getAttribute('data-module');
                this.navigateToModule(module);
            });
        });
    }

    navigateToModule(module) {
        switch (module) {
            case 'asn':
                window.dispatchEvent(new CustomEvent('navigateToASN'));
                break;
            case 'items':
                alert('Módulo de Items - En desarrollo');
                break;
            case 'orders':
                window.dispatchEvent(new CustomEvent('navigateToOrders'));
                break;
            default:
                console.log('Módulo no reconocido:', module);
        }
    }
}