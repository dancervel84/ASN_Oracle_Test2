import { ModalService } from './modal-service.js';
import * as XLSX from 'xlsx';

export class CSVProcessor {
    constructor(apiService) {
        this.apiService = apiService;
        this.modal = new ModalService();
    }

    init() {
        this.uploadCsvBtn = document.getElementById('upload-csv-btn');
        this.csvFileInput = document.getElementById('csv-file-input');

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

            const shipments = this.parseFileData(data);
            const results = await this.processShipments(shipments);
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
                shipment_nbr: columns[0] || '',
                facility_code: columns[1] || '',
                company_code: columns[2] || '',
                manifest_nbr: columns[3] || '',
                shipped_date: columns[4] || '',
                cust_field_1: columns[5] || '',
                seq_nbr: columns[6] || '',
                item_part_a: columns[7] || '',
                lpn_nbr: columns[8] || '',
                shipped_qty: columns[9] || '',
                batch_nbr: columns[10] || '',
                expiry_date: columns[11] || ''
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
                        shipment_nbr: row[0] || '',
                        facility_code: row[1] || '',
                        company_code: row[2] || '',
                        manifest_nbr: row[3] || '',
                        shipped_date: this.formatExcelDate(row[4]) || '',
                        cust_field_1: row[5] || '',
                        seq_nbr: row[6] || '',
                        item_part_a: row[7] || '',
                        lpn_nbr: row[8] || '',
                        shipped_qty: row[9] || '',
                        batch_nbr: row[10] || '',
                        expiry_date: this.formatExcelDate(row[11]) || ''
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
        
        // If it's already a string in DD/MM/YYYY format, return as is
        if (typeof dateValue === 'string' && dateValue.includes('/')) {
            return dateValue;
        }
        
        // If it's an Excel serial date number
        if (typeof dateValue === 'number') {
            const excelDate = XLSX.SSF.parse_date_code(dateValue);
            if (excelDate) {
                const day = String(excelDate.d).padStart(2, '0');
                const month = String(excelDate.m).padStart(2, '0');
                const year = excelDate.y;
                return `${day}/${month}/${year}`;
            }
        }
        
        return dateValue.toString();
    }

    parseFileData(data) {
        const shipments = {};
        
        data.forEach(row => {
            if (!row.shipment_nbr) return; // Skip empty rows

            const { shipment_nbr, facility_code, company_code, manifest_nbr, shipped_date, cust_field_1, 
                    item_part_a, lpn_nbr, shipped_qty, batch_nbr, expiry_date } = row;

            if (!shipments[shipment_nbr]) {
                // Convert DD/MM/YYYY to YYYY-MM-DD for shipped_date
                let formattedShippedDate = shipped_date;
                if (shipped_date && shipped_date.includes('/')) {
                    const dateParts = shipped_date.split('/');
                    if (dateParts.length === 3) {
                        formattedShippedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    }
                }
                
                shipments[shipment_nbr] = {
                    headerData: { 
                        shipment_nbr, 
                        facility_code, 
                        company_code, 
                        manifest_nbr, 
                        shipped_date: formattedShippedDate, 
                        cust_field_1 
                    },
                    itemLinesData: []
                };
            }
            
            // Format expiry_date if it exists
            let formattedExpiryDate = '';
            if (expiry_date && expiry_date.includes('/')) {
                const dateParts = expiry_date.split('/');
                if (dateParts.length === 3) {
                    formattedExpiryDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                }
            }
            
            shipments[shipment_nbr].itemLinesData.push({
                item_part_a,
                shipped_qty,
                lpn_nbr,
                batch_nbr,
                expiry_date: formattedExpiryDate
            });
        });

        return shipments;
    }

    async processShipments(shipments) {
        const apiRequests = Object.values(shipments).map(async (shipment) => {
            try {
                await this.apiService.sendShipment(shipment.headerData, shipment.itemLinesData);
                return { status: 'fulfilled', value: shipment.headerData.shipment_nbr };
            } catch (error) {
                return { 
                    status: 'rejected', 
                    reason: `ASN ${shipment.headerData.shipment_nbr}: ${error.message}` 
                };
            }
        });

        return await Promise.all(apiRequests);
    }

    showResults(results) {
        const successes = results.filter(r => r.status === 'fulfilled');
        const failures = results.filter(r => r.status === 'rejected');
        
        let summaryMessage = `Proceso completado. ${successes.length} de ${results.length} embarques enviados con éxito.`;
        
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