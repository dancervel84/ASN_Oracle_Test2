import { ModalService } from './modal-service.js';

export class ItemFormHandler {
    constructor(itemApiService) {
        this.itemApiService = itemApiService;
        this.modal = new ModalService();
    }

    init() {
        this.form = document.getElementById('item-form');
        this.reqBatchCheckbox = document.getElementById('req_batch_nbr_flg');
        this.productLifeContainer = document.getElementById('product_life_container');

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.reqBatchCheckbox.addEventListener('change', () => this.toggleProductLifeField());
    }

    toggleProductLifeField() {
        if (this.reqBatchCheckbox.checked) {
            this.productLifeContainer.style.display = 'block';
            document.getElementById('product_life').required = true;
        } else {
            this.productLifeContainer.style.display = 'none';
            document.getElementById('product_life').required = false;
            document.getElementById('product_life').value = '';
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        this.modal.show('loading', 'Procesando...', 'Enviando datos del artículo al servidor de WMS. Por favor, espere.');

        try {
            const formData = new FormData(this.form);
            const itemData = this.extractItemData(formData);

            const success = await this.itemApiService.sendItem(itemData);
            
            if (success) {
                this.modal.show('success', 'Éxito', 'El artículo ha sido registrado correctamente en WMS.');
                this.resetForm();
            }
        } catch (error) {
            console.error('Item form submission error:', error);
        }
    }

    extractItemData(formData) {
        return {
            company_code: formData.get('company_code'),
            part_a: formData.get('part_a'),
            description: formData.get('description'),
            barcode: formData.get('barcode'),
            max_case_qty: formData.get('max_case_qty'),
            lpns_per_tier: formData.get('lpns_per_tier'),
            tiers_per_pallet: formData.get('tiers_per_pallet'),
            req_batch_nbr_flg: formData.get('req_batch_nbr_flg') ? 'yes' : 'no',
            product_life: formData.get('product_life') || '',
            description_2: formData.get('description_2')
        };
    }

    resetForm() {
        this.form.reset();
        this.productLifeContainer.style.display = 'none';
        document.getElementById('product_life').required = false;
    }
}