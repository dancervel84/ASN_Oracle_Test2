import { ModalService } from './modal-service.js';
import * as XLSX from 'xlsx';

export class ItemCSVProcessor {
    constructor(itemApiService) {
        this.itemApiService = itemApiService;
        this.modal = new ModalService();
    }

    init() {
        this.uploadCsvBtn = document.getElementById('upload-item-csv-btn');
        this.csvFileInput = document.getElementById('item-csv-file-input');

        this.uploadCsvBtn.addEventListener('click', () => this.csvFileInput.click());
        this.csvFileInput.addEventListener('change', (event) => this.handleFileChange(event));
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
                this.processFile(file, fileExtension);
            } else {
                this.modal.show('error', 'Tipo de Archivo Incorrecto', 'Por favor, selecciona un archivo con formato .csv, .xlsx o .xls');
            }
        }
    }

    async processFile(file, fileExtension) {
        this.modal.show('loading', 'Procesando Archivo...', 'Leyendo y enviando datos desde el archivo. Por favor, espere.');
        
        try {
            let data;
            
            if (fileExtension === 'csv') {
                data = await this.processCSVFile(file);
            } else {
                data = await this.processExcelFile(file);
            }

            if (data.length === 0) {
                this.modal.show('error', 'Archivo Vacío', 'El archivo no contiene datos para procesar.');
                return;
            }

            const results = await this.processItems(data);
            this.showResults(results);
            
            // Reset file input
            this.csvFileInput.value = '';
        } catch (error) {
            this.modal.show('error', 'Error de Procesamiento', 'Hubo un error al procesar el archivo.');
            console.error('File processing error:', error);
        }
    }

    async processCSVFile(file) {
        const fileContent = await file.text();
        const lines = fileContent.trim().split(/\r\n|\n/);
        lines.shift(); // Remove header
        
        return lines.map(line => {
            const columns = line.split(',').map(c => c.trim());
            return {
                company_code: columns[0] || '',
                part_a: columns[1] || '',
                description: columns[2] || '',
                barcode: columns[3] || '',
                max_case_qty: columns[4] || '',
                lpns_per_tier: columns[5] || '',
                tiers_per_pallet: columns[6] || '',
                req_batch_nbr_flg: columns[7] || '',
                product_life: columns[8] || '',
                description_2: columns[9] || '',
                primary_uom_code: columns[10] || '',
                pack_uom_code: columns[11] || ''
            };
        });
    }

    async processExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    // Remove header row and convert to objects
                    const dataRows = jsonData.slice(1);
                    const processedData = dataRows.map(row => ({
                        company_code: row[0] || '',
                        part_a: row[1] || '',
                        description: row[2] || '',
                        barcode: row[3] || '',
                        max_case_qty: row[4] || '',
                        lpns_per_tier: row[5] || '',
                        tiers_per_pallet: row[6] || '',
                        req_batch_nbr_flg: row[7] || '',
                        product_life: row[8] || '',
                        description_2: row[9] || '',
                        primary_uom_code: row[10] || '',
                        pack_uom_code: row[11] || ''
                    }));
                    
                    resolve(processedData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async processItems(items) {
        const apiRequests = items.map(async (item) => {
            try {
                // Convert req_batch_nbr_flg to proper format
                if (item.req_batch_nbr_flg && (item.req_batch_nbr_flg.toLowerCase() === 'yes' || item.req_batch_nbr_flg.toLowerCase() === 'si' || item.req_batch_nbr_flg === '1')) {
                    item.req_batch_nbr_flg = 'yes';
                } else {
                    item.req_batch_nbr_flg = '';
                }

                await this.itemApiService.sendItem(item);
                return { status: 'fulfilled', value: item.part_a };
            } catch (error) {
                return { 
                    status: 'rejected', 
                    reason: `Artículo ${item.part_a}: ${error.message}` 
                };
            }
        });

        return await Promise.all(apiRequests);
    }

    showResults(results) {
        const successes = results.filter(r => r.status === 'fulfilled');
        const failures = results.filter(r => r.status === 'rejected');
        
        let summaryMessage = `Proceso completado. ${successes.length} de ${results.length} artículos enviados con éxito.`;
        
        if (failures.length > 0) {
            const failureDetails = failures.map(f => f.reason).join('\n');
            summaryMessage += `\n\nErrores:\n${failureDetails}`;
        }

        this.modal.show(
            failures.length > 0 ? 'error' : 'success',
            'Resultados del Procesamiento',
            summaryMessage
        );
    }
}