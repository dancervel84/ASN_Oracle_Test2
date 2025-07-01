import { ModalService } from './modal-service.js';
import * as XLSX from 'xlsx';

export class OrderCSVProcessor {
    constructor(orderApiService) {
        this.orderApiService = orderApiService;
        this.modal = new ModalService();
    }

    init() {
        this.uploadCsvBtn = document.getElementById('upload-order-csv-btn');
        this.csvFileInput = document.getElementById('order-csv-file-input');

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

            const orders = this.parseFileData(data);
            const results = await this.processOrders(orders);
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
                facility_code: columns[0] || '',
                company_code: columns[1] || '',
                order_nbr: columns[2] || '',
                ord_date: columns[3] || '',
                req_ship_date: columns[4] || '',
                dest_facility_code: columns[5] || '',
                ref_nbr: columns[6] || '',
                seq_nbr: columns[7] || '',
                item_alternate_code: columns[8] || '',
                ord_qty: columns[9] || '',
                req_cntr_nbr: columns[10] || '',
                batch_nbr: columns[11] || ''
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
                        facility_code: row[0] || '',
                        company_code: row[1] || '',
                        order_nbr: row[2] || '',
                        ord_date: this.formatExcelDate(row[3]) || '',
                        req_ship_date: this.formatExcelDate(row[4]) || '',
                        dest_facility_code: row[5] || '',
                        ref_nbr: row[6] || '',
                        seq_nbr: row[7] || '',
                        item_alternate_code: row[8] || '',
                        ord_qty: row[9] || '',
                        req_cntr_nbr: row[10] || '',
                        batch_nbr: row[11] || ''
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

    formatExcelDate(dateValue) {
        if (!dateValue) return '';
        
        // If it's already a string in DD/MM/YYYY format, convert to YYYY-MM-DD
        if (typeof dateValue === 'string' && dateValue.includes('/')) {
            const dateParts = dateValue.split('/');
            if (dateParts.length === 3) {
                return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
        }
        
        // If it's an Excel serial date number
        if (typeof dateValue === 'number') {
            const excelDate = XLSX.SSF.parse_date_code(dateValue);
            if (excelDate) {
                const day = String(excelDate.d).padStart(2, '0');
                const month = String(excelDate.m).padStart(2, '0');
                const year = excelDate.y;
                return `${year}-${month}-${day}`;
            }
        }
        
        return dateValue.toString();
    }

    parseFileData(data) {
        const orders = {};
        
        data.forEach(row => {
            if (!row.order_nbr) return; // Skip empty rows

            const { facility_code, company_code, order_nbr, ord_date, req_ship_date, dest_facility_code, ref_nbr,
                    seq_nbr, item_alternate_code, ord_qty, req_cntr_nbr, batch_nbr } = row;

            if (!orders[order_nbr]) {
                orders[order_nbr] = {
                    headerData: { 
                        facility_code, 
                        company_code, 
                        order_nbr, 
                        ord_date, 
                        req_ship_date, 
                        dest_facility_code, 
                        ref_nbr 
                    },
                    itemLinesData: []
                };
            }
            
            orders[order_nbr].itemLinesData.push({
                seq_nbr: seq_nbr || orders[order_nbr].itemLinesData.length + 1,
                item_alternate_code,
                ord_qty,
                req_cntr_nbr,
                batch_nbr
            });
        });

        return orders;
    }

    async processOrders(orders) {
        const apiRequests = Object.values(orders).map(async (order) => {
            try {
                await this.orderApiService.sendOrder(order.headerData, order.itemLinesData);
                return { status: 'fulfilled', value: order.headerData.order_nbr };
            } catch (error) {
                return { 
                    status: 'rejected', 
                    reason: `Orden ${order.headerData.order_nbr}: ${error.message}` 
                };
            }
        });

        return await Promise.all(apiRequests);
    }

    showResults(results) {
        const successes = results.filter(r => r.status === 'fulfilled');
        const failures = results.filter(r => r.status === 'rejected');
        
        let summaryMessage = `Proceso completado. ${successes.length} de ${results.length} órdenes enviadas con éxito.`;
        
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