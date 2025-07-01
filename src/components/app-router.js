import { AuthService } from './auth-service.js';
import { createLoginHTML } from './login-template.js';
import { createDashboardHTML } from './dashboard-template.js';
import { createFormHTML } from './form-template.js';
import { createOrderFormHTML } from './order-form-template.js';
import { createItemFormHTML } from './item-form-template.js';
import { createModalHTML } from './modal-template.js';
import { LoginHandler } from './login-handler.js';
import { DashboardHandler } from './dashboard-handler.js';
import { FormHandler } from './form-handler.js';
import { OrderFormHandler } from './order-form-handler.js';
import { ItemFormHandler } from './item-form-handler.js';
import { CSVProcessor } from './csv-processor.js';
import { OrderCSVProcessor } from './order-csv-processor.js';
import { ItemCSVProcessor } from './item-csv-processor.js';
import { APIService } from './api-service.js';
import { OrderAPIService } from './order-api-service.js';
import { ItemAPIService } from './item-api-service.js';
import { AppointmentAPIService } from './appointment-api-service.js';

export class AppRouter {
    constructor() {
        this.authService = new AuthService();
        this.currentView = 'login';
        this.app = document.getElementById('app');
    }

    init() {
        // Check if user is already authenticated
        if (this.authService.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }

        // Listen for authentication events
        window.addEventListener('loginSuccess', () => this.showDashboard());
        window.addEventListener('logout', () => this.showLogin());
        window.addEventListener('navigateToASN', () => this.showASNModule());
        window.addEventListener('navigateToOrders', () => this.showOrdersModule());
        window.addEventListener('navigateToItems', () => this.showItemsModule());
    }

    showLogin() {
        this.currentView = 'login';
        this.app.innerHTML = createLoginHTML();
        
        const loginHandler = new LoginHandler();
        loginHandler.init();
    }

    showDashboard() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            this.showLogin();
            return;
        }

        this.currentView = 'dashboard';
        this.app.innerHTML = createDashboardHTML(user);
        
        const dashboardHandler = new DashboardHandler();
        dashboardHandler.init();
    }

    showASNModule() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            this.showLogin();
            return;
        }

        this.currentView = 'asn';
        this.app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                <!-- Header with back button -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <button id="back-to-dashboard" class="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                                <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM19.5 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                                    </svg>
                                </div>
                                <h1 class="text-xl font-semibold text-gray-900">ASN - Interfaz de Entrada de Embarques</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm font-medium text-gray-900">Usuario: ${user.usuario}</div>
                                    <div class="text-xs text-gray-500 max-w-xs truncate" title="${user.compania}">
                                        ${user.compania}
                                    </div>
                                </div>
                                <button id="logout-btn" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- ASN Module Content -->
                <div class="py-6">
                    ${createFormHTML()}
                </div>
            </div>
            ${createModalHTML()}
        `;

        // Initialize ASN module functionality
        const apiService = new APIService();
        const appointmentApiService = new AppointmentAPIService();
        const csvProcessor = new CSVProcessor(apiService, appointmentApiService);
        const formHandler = new FormHandler(apiService, appointmentApiService);
        
        formHandler.init();
        csvProcessor.init();

        // Add navigation event listeners
        const backBtn = document.getElementById('back-to-dashboard');
        const logoutBtn = document.getElementById('logout-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => this.showDashboard());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authService.logout();
                this.showLogin();
            });
        }
    }

    showOrdersModule() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            this.showLogin();
            return;
        }

        this.currentView = 'orders';
        this.app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                <!-- Header with back button -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <button id="back-to-dashboard" class="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                                <div class="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                </div>
                                <h1 class="text-xl font-semibold text-gray-900">Órdenes - Interfaz de Órdenes de Venta</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm font-medium text-gray-900">Usuario: ${user.usuario}</div>
                                    <div class="text-xs text-gray-500 max-w-xs truncate" title="${user.compania}">
                                        ${user.compania}
                                    </div>
                                </div>
                                <button id="logout-btn" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Orders Module Content -->
                <div class="py-6">
                    ${createOrderFormHTML()}
                </div>
            </div>
            ${createModalHTML()}
        `;

        // Initialize Orders module functionality
        const orderApiService = new OrderAPIService();
        const orderCsvProcessor = new OrderCSVProcessor(orderApiService);
        const orderFormHandler = new OrderFormHandler(orderApiService);
        
        orderFormHandler.init();
        orderCsvProcessor.init();

        // Add navigation event listeners
        const backBtn = document.getElementById('back-to-dashboard');
        const logoutBtn = document.getElementById('logout-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => this.showDashboard());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authService.logout();
                this.showLogin();
            });
        }
    }

    showItemsModule() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            this.showLogin();
            return;
        }

        this.currentView = 'items';
        this.app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                <!-- Header with back button -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <button id="back-to-dashboard" class="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                                <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>
                                <h1 class="text-xl font-semibold text-gray-900">Items - Interfaz de Artículos</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm font-medium text-gray-900">Usuario: ${user.usuario}</div>
                                    <div class="text-xs text-gray-500 max-w-xs truncate" title="${user.compania}">
                                        ${user.compania}
                                    </div>
                                </div>
                                <button id="logout-btn" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Items Module Content -->
                <div class="py-6">
                    ${createItemFormHTML()}
                </div>
            </div>
            ${createModalHTML()}
        `;

        // Initialize Items module functionality
        const itemApiService = new ItemAPIService();
        const itemCsvProcessor = new ItemCSVProcessor(itemApiService);
        const itemFormHandler = new ItemFormHandler(itemApiService);
        
        itemFormHandler.init();
        itemCsvProcessor.init();

        // Add navigation event listeners
        const backBtn = document.getElementById('back-to-dashboard');
        const logoutBtn = document.getElementById('logout-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => this.showDashboard());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authService.logout();
                this.showLogin();
            });
        }
    }
}
