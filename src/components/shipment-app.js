import { createFormHTML } from './form-template.js';
import { createModalHTML } from './modal-template.js';
import { FormHandler } from './form-handler.js';
import { CSVProcessor } from './csv-processor.js';
import { APIService } from './api-service.js';

export function initializeApp() {
    const app = document.getElementById('app');
    
    // Create the main application HTML
    app.innerHTML = `
        ${createFormHTML()}
        ${createModalHTML()}
    `;
    
    // Initialize services
    const apiService = new APIService();
    const csvProcessor = new CSVProcessor(apiService);
    const formHandler = new FormHandler(apiService);
    
    // Initialize form functionality
    formHandler.init();
    csvProcessor.init();
}