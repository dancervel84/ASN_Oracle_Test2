import { ModalService } from './modal-service.js';

export class FormHandler {
    constructor(apiService, appointmentApiService) {
        this.apiService = apiService;
        this.appointmentApiService = appointmentApiService;
        this.modal = new ModalService();
        this.itemLineCounter = 0;
    }

    init() {
        this.form = document.getElementById('shipment-form');
        this.addItemBtn = document.getElementById('add-item-btn');
        this.itemLinesContainer = document.getElementById('item-lines-container');
        this.sendAppointmentBtn = document.getElementById('send-appointment-btn');

        this.addItemBtn.addEventListener('click', () => this.addLineItem());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.sendAppointmentBtn.addEventListener('click', (e) => this.handleAppointmentSubmit(e));
        this.sendAppointmentBtn.disabled = true;
        
        // Add initial line item
        this.addLineItem();
    }

    addLineItem() {
        this.itemLineCounter++;
        const lineId = `item-line-${this.itemLineCounter}`;
        const itemLineHTML = `
            <div id="${lineId}" class="item-line">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label class="form-label">Artículo <span class="text-red-500">*</span></label>
                        <input type="text" name="item_part_a" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">Cantidad <span class="text-red-500">*</span></label>
                        <input type="number" name="shipped_qty" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">LPN</label>
                        <input type="text" name="lpn_nbr" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Lote</label>
                        <input type="text" name="batch_nbr" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Expiración</label>
                        <input type="date" name="expiry_date" class="form-input">
                    </div>
                </div>
                <button type="button" class="btn-danger absolute -top-2 -right-2" onclick="document.getElementById('${lineId}').remove()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        this.itemLinesContainer.insertAdjacentHTML('beforeend', itemLineHTML);
    }

    async handleAppointmentSubmit(event) {
        event.preventDefault();
        
        // Validate required fields for appointment
        const requiredFields = ['shipment_nbr', 'facility_code', 'company_code', 'shipped_date', 'arrival_time', 'unload_duration'];
        const formData = new FormData(this.form);
        
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                this.modal.show('error', 'Error de Validación', `El campo ${field} es requerido para crear la cita.`);
                return;
            }
        }

        this.modal.show('loading', 'Creando Cita...', 'Enviando datos de la cita al servidor de WMS. Por favor, espere.');

        try {
            const appointmentData = this.extractAppointmentData(formData);
            const success = await this.appointmentApiService.sendAppointment(appointmentData);
            
            if (success) {
                this.modal.show('success', 'Cita Creada', 'La cita ha sido registrada correctamente en WMS.');
                this.resetForm();
            }
        } catch (error) {
            console.error('Appointment submission error:', error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        const itemLines = document.querySelectorAll('.item-line');
        if (itemLines.length === 0) {
            this.modal.show('error', 'Error de Validación', 'Debe agregar al menos un artículo al embarque.');
            return;
        }

        this.modal.show('loading', 'Procesando...', 'Enviando datos al servidor de WMS. Por favor, espere.');

        try {
            const formData = new FormData(this.form);
            const headerData = this.extractHeaderData(formData);
            const itemLinesData = this.extractItemLinesData(itemLines);

            const success = await this.apiService.sendShipment(headerData, itemLinesData);
            
            if (success) {
                this.modal.show('success', 'Éxito', 'El embarque ha sido registrado correctamente en WMS.');
              
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    }

    extractAppointmentData(formData) {
        return {
            shipment_nbr: formData.get('shipment_nbr'),
            facility_code: formData.get('facility_code'),
            company_code: formData.get('company_code'),
            shipped_date: formData.get('shipped_date'),
            arrival_time: formData.get('arrival_time'),
            unload_duration: formData.get('unload_duration')
        };
    }

    extractHeaderData(formData) {
        return {
            shipment_nbr: formData.get('shipment_nbr'),
            facility_code: formData.get('facility_code'),
            company_code: formData.get('company_code'),
            manifest_nbr: formData.get('manifest_nbr'),
            shipped_date: formData.get('shipped_date'),
            cust_field_1: formData.get('cust_field_1'),
        };
    }

    extractItemLinesData(itemLines) {
        return Array.from(itemLines).map(line => ({
            item_part_a: line.querySelector('[name="item_part_a"]').value,
            shipped_qty: line.querySelector('[name="shipped_qty"]').value,
            batch_nbr: line.querySelector('[name="batch_nbr"]').value || '',
            expiry_date: line.querySelector('[name="expiry_date"]').value || '',
            lpn_nbr: line.querySelector('[name="lpn_nbr"]').value || ''
        }));
    }

    resetForm() {
        this.form.reset();
        this.itemLinesContainer.innerHTML = '';
        this.addLineItem();
    }
}