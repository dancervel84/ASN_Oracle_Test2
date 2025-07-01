import { ModalService } from './modal-service.js';

export class ItemFormHandler {
    constructor(itemApiService) {
        this.itemApiService = itemApiService;
        this.modal = new ModalService();
        this.itemLineCounter = 0;
    }

    init() {
        this.form = document.getElementById('item-form');
        this.addItemBtn = document.getElementById('add-item-btn');
        this.itemLinesContainer = document.getElementById('item-lines-container');
        this.batchCheckbox = document.getElementById('req_batch_nbr_flg');
        this.batchFields = document.getElementById('batch-fields');

        this.addItemBtn.addEventListener('click', () => this.addLineItem());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.batchCheckbox.addEventListener('change', () => this.toggleBatchFields());
        
        // Add initial line item
        this.addLineItem();
    }

    toggleBatchFields() {
        if (this.batchCheckbox.checked) {
            this.batchFields.classList.remove('hidden');
        } else {
            this.batchFields.classList.add('hidden');
        }
    }

    addLineItem() {
        this.itemLineCounter++;
        const lineId = `item-line-${this.itemLineCounter}`;
        const itemLineHTML = `
            <div id="${lineId}" class="item-line">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="form-label">Cuenta <span class="text-red-500">*</span></label>
                        <input type="text" name="company_code" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">Artículo <span class="text-red-500">*</span></label>
                        <input type="text" name="part_a" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">Descripción <span class="text-red-500">*</span></label>
                        <input type="text" name="description" class="form-input" required>
                    </div>
                    <div>
                        <label class="form-label">Código de Barras</label>
                        <input type="text" name="barcode" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Tot Cajas/Bultos</label>
                        <input type="number" name="max_case_qty" class="form-input" min="0">
                    </div>
                    <div>
                        <label class="form-label">Cajas x Cama</label>
                        <input type="number" name="lpns_per_tier" class="form-input" min="0">
                    </div>
                    <div>
                        <label class="form-label">Camas x LPN</label>
                        <input type="number" name="tiers_per_pallet" class="form-input" min="0">
                    </div>
                    <div>
                        <label class="form-label">UOM Primario</label>
                        <input type="text" name="primary_uom_code" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">UOM Empaque</label>
                        <input type="text" name="pack_uom_code" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Sub-Cuenta</label>
                        <input type="text" name="description_2" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Descripción Alterna</label>
                        <input type="text" name="description_3" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Días de Vida</label>
                        <input type="number" name="product_life" class="form-input" min="0">
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="req_batch_nbr_flg" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label class="ml-2 block text-sm text-gray-900">Requiere Lote</label>
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

        const itemLines = document.querySelectorAll('#item-lines-container .item-line');
        if (itemLines.length === 0) {
            this.modal.show('error', 'Error de Validación', 'Debe agregar al menos un artículo.');
            return;
        }

        this.modal.show('loading', 'Procesando...', 'Enviando datos de artículos al servidor de WMS. Por favor, espere.');

        try {
            const itemsData = this.extractItemsData(itemLines);
            const success = await this.itemApiService.sendItem(itemsData);
            
            if (success) {
                this.modal.show('success', 'Éxito', 'Los artículos han sido registrados correctamente en WMS.');
                this.resetForm();
            }
        } catch (error) {
            console.error('Item form submission error:', error);
        }
    }

    extractItemsData(itemLines) {
        return Array.from(itemLines).map(line => {
            const batchCheckbox = line.querySelector('[name="req_batch_nbr_flg"]');
            return {
                company_code: line.querySelector('[name="company_code"]').value || '',
                part_a: line.querySelector('[name="part_a"]').value || '',
                description: line.querySelector('[name="description"]').value || '',
                barcode: line.querySelector('[name="barcode"]').value || '',
                max_case_qty: line.querySelector('[name="max_case_qty"]').value || '',
                lpns_per_tier: line.querySelector('[name="lpns_per_tier"]').value || '',
                tiers_per_pallet: line.querySelector('[name="tiers_per_pallet"]').value || '',
                primary_uom_code: line.querySelector('[name="primary_uom_code"]').value || '',
                pack_uom_code: line.querySelector('[name="pack_uom_code"]').value || '',
                description_2: line.querySelector('[name="description_2"]').value || '',
                description_3: line.querySelector('[name="description_3"]').value || '',
                product_life: line.querySelector('[name="product_life"]').value || '',
                req_batch_nbr_flg: batchCheckbox && batchCheckbox.checked ? 'yes' : ''
            };
        });
    }

    resetForm() {
        this.form.reset();
        this.itemLinesContainer.innerHTML = '';
        this.batchFields.classList.add('hidden');
        this.addLineItem();
    }
}