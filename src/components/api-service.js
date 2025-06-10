import { ModalService } from './modal-service.js';

export class APIService {
    constructor() {
        this.apiUrl = 'https://ta35.wms.ocs.oraclecloud.com:443/grupocice_test/wms/api/init_stage_interface/';
        this.apiAuth = 'Basic bG9nZmlyZTpHcnVwb2NpY2UyMDI0';
        this.modal = new ModalService();
    }

    async sendShipment(headerData, itemLinesData) {
        try {
            const xmlPayload = this.buildXMLPayload(headerData, itemLinesData);
            const bodyParams = new URLSearchParams({
                'entity': 'ib_shipment',
                'xml_data': xmlPayload
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.apiAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyParams
            });

            if (response.ok) {
                return true;
            } else {
                const errorText = await response.text();
                this.modal.show('error', 'Error del Servidor', 
                    `Hubo un problema. Estado: ${response.status}. Respuesta: ${errorText || 'Sin detalles.'}`);
                throw new Error(`API Error: ${response.status} - ${errorText || 'Unknown error'}`);
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.modal.show('error', 'Error de Conexión', 
                    'No se pudo conectar con el servidor. Revise su conexión a internet.');
            } else if (!error.message.includes('API Error:')) {
                this.modal.show('error', 'Error Inesperado', 
                    'Ocurrió un error inesperado. Revise la consola para más detalles.');
            }
            throw error;
        }
    }

    buildXMLPayload(headerData, itemLinesData) {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19);
        
        const itemDetailsXML = itemLinesData.map((item, index) => {
            const expiry_date = item.expiry_date ? 
                new Date(item.expiry_date).toLocaleDateString('en-GB') : '';
            
            return `
                <ib_shipment_dtl>
                    <seq_nbr>${index + 1}</seq_nbr>
                    <action_code>CREATE</action_code>
                    <lpn_nbr>${item.lpn_nbr || ''}</lpn_nbr>
                    <item_part_a>${item.item_part_a || ''}</item_part_a>
                    <shipped_qty>${item.shipped_qty || ''}</shipped_qty>
                    <expiry_date>${expiry_date || ''}</expiry_date>
                    <batch_nbr>${item.batch_nbr || ''}</batch_nbr>
                    <uom_code>UNITS</uom_code>
                </ib_shipment_dtl>
            `;
        }).join('');

        return `<?xml version="1.0" encoding="utf-8"?>
<LgfData>
    <Header>
        <DocumentVersion>23C</DocumentVersion>
        <OriginSystem>Host</OriginSystem>
        <ClientEnvCode>QA</ClientEnvCode>
        <ParentCompanyCode>QATCTPC</ParentCompanyCode>
        <Entity>ib_shipment</Entity>
        <TimeStamp>${timestamp}</TimeStamp>
        <MessageId>InboundShipment</MessageId>
    </Header>
    <ListOfIbShipments>
        <ib_shipment>
            <ib_shipment_hdr>
                <shipment_nbr>${headerData.shipment_nbr}</shipment_nbr>
                <facility_code>${headerData.facility_code}</facility_code>
                <company_code>${headerData.company_code}</company_code>
                <action_code>CREATE</action_code>
                <shipment_type>ENT</shipment_type>
                <manifest_nbr>${headerData.manifest_nbr}</manifest_nbr>
                <shipped_date>${headerData.shipped_date}</shipped_date>
                <cust_field_1>${headerData.cust_field_1}</cust_field_1>
            </ib_shipment_hdr>
            ${itemDetailsXML}
        </ib_shipment>
    </ListOfIbShipments>
</LgfData>`;
    }
}