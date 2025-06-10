export class ModalService {
    constructor() {
        this.modal = null;
        this.modalIconContainer = null;
        this.modalTitle = null;
        this.modalMessage = null;
        this.modalCloseBtn = null;
        
        this.icons = {
            success: `<svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
            error: `<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`,
            loading: `<svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
        };
        
        this.iconClasses = {
            success: 'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10',
            error: 'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10',
            loading: 'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'
        };
    }

    init() {
        this.modal = document.getElementById('message-modal');
        this.modalIconContainer = document.getElementById('modal-icon-container');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalCloseBtn = document.getElementById('modal-close-btn');
        
        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => this.hide());
        }
    }

    show(type, title, message) {
        // Initialize if not already done
        if (!this.modal) {
            this.init();
        }

        if (this.modalIconContainer && this.icons[type]) {
            this.modalIconContainer.innerHTML = this.icons[type];
            this.modalIconContainer.className = this.iconClasses[type];
        }
        
        if (this.modalTitle) {
            this.modalTitle.textContent = title;
        }
        
        if (this.modalMessage) {
            this.modalMessage.textContent = message;
        }
        
        if (this.modal) {
            this.modal.classList.remove('hidden');
        }
    }

    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
}