import { ModalService } from './modal-service.js';

export class ItemFormHandler {
    constructor(itemApiService) {
        this.itemApiService = itemApiService;
        this.modal = new ModalService();
    }

    init() {
        this.form = document.getElementById('item-form');
        this.batchCheckbox = document.getElementById('req_batch_nbr_flg');
        this.productLifeContainer = document.getElementById('product_life_container');

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.batchCheckbox.addEventListener('change', () => this.toggleProductLife());
    }

    toggleProductLife() {
        if (this.batchCheckbox.checked) {
            this.productLifeContainer.classList.remove('hidden');
        } else {
            this.productLifeContainer.classList.add('hidden');
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
            req_batch_nbr_flg: formData.get('req_batch_nbr_flg') ? 'yes' : '',
            product_life: formData.get('product_life'),
            description_2: formData.get('description_2'),
            primary_uom_code: formData.get('primary_uom_code'),
            pack_uom_code: formData.get('pack_uom_code')
        };
    }

    resetForm() {
        this.form.reset();
        this.productLifeContainer.classList.add('hidden');
    }
}