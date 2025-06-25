import { ModalService } from './modal-service.js';

export class OrderFormHandler {
    constructor(orderApiService) {
        this.orderApiService = orderApiService;
        this.modal = new ModalService();
        this.itemLineCounter = 0;
    }

    init() {
        this.form = document.getElementById('order-form');
        this.addItemBtn = document.getElementById('add-order-item-btn');
        this.itemLinesContainer = document.getElementById('order-item-lines-container');

        this.addItemBtn.addEventListener('click', () => this.addLineItem());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add initial line item
        this.addLineItem();
    }

    addLineItem() {
        this.itemLineCounter++;
        const lineId = `order-item-line-${this.itemLineCounter}`;
        const itemLineHTML = `
            <div id="${lineId}" class="item-line">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="form-label">Artículo <span class="text-red-500">*</span></label>
                        <input type="text" name="item_alternate_code" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">Cantidad <span class="text-red-500">*</span></label>
                        <input type="number" name="ord_qty" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">LPN</label>
                        <input type="text" name="req_cntr_nbr" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Lote</label>
                        <input type="text" name="batch_nbr" class="form-input">
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

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        const itemLines = document.querySelectorAll('#order-item-lines-container .item-line');
        if (itemLines.length === 0) {
            this.modal.show('error', 'Error de Validación', 'Debe agregar al menos un artículo a la orden.');
            return;
        }

        this.modal.show('loading', 'Procesando...', 'Enviando datos de la orden al servidor de WMS. Por favor, espere.');

        try {
            const formData = new FormData(this.form);
            const headerData = this.extractHeaderData(formData);
            const itemLinesData = this.extractItemLinesData(itemLines);

            const success = await this.orderApiService.sendOrder(headerData, itemLinesData);
            
            if (success) {
                this.modal.show('success', 'Éxito', 'La orden ha sido registrada correctamente en WMS.');
                this.resetForm();
            }
        } catch (error) {
            console.error('Order form submission error:', error);
        }
    }

    extractHeaderData(formData) {
        return {
            facility_code: formData.get('facility_code'),
            company_code: formData.get('company_code'),
            order_nbr: formData.get('order_nbr'),
            ord_date: formData.get('ord_date'),
            req_ship_date: formData.get('req_ship_date'),
            dest_facility_code: formData.get('dest_facility_code'),
            ref_nbr: formData.get('ref_nbr')
        };
    }

    extractItemLinesData(itemLines) {
        return Array.from(itemLines).map((line, index) => ({
            seq_nbr: index + 1,
            item_alternate_code: line.querySelector('[name="item_alternate_code"]').value,
            ord_qty: line.querySelector('[name="ord_qty"]').value,
            req_cntr_nbr: line.querySelector('[name="req_cntr_nbr"]').value || '',
            batch_nbr: line.querySelector('[name="batch_nbr"]').value || ''
        }));
    }

    resetForm() {
        this.form.reset();
        this.itemLinesContainer.innerHTML = '';
        this.addLineItem();
    }
}