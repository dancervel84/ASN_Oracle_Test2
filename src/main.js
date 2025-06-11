import './style.css'
import { AppRouter } from './components/app-router.js'

// Initialize the application router
document.addEventListener('DOMContentLoaded', () => {
    const router = new AppRouter();
    router.init();
});