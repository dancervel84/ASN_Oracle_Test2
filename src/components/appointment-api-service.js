import { ModalService } from './modal-service.js';

export class AppointmentAPIService {
    constructor() {
        this.apiUrl = 'https://ta35.wms.ocs.oraclecloud.com:443/grupocice_test/wms/api/init_stage_interface/';
        this.apiAuth = 'Basic bG9nZmlyZTpHcnVwb2NpY2UyMDI0';
        this.modal = new ModalService();
    }

    async sendAppointment(appointmentData) {
        try {
            const xmlPayload = this.buildAppointmentXMLPayload(appointmentData);
            const bodyParams = new URLSearchParams({
                'entity': 'appointment',
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

    buildAppointmentXMLPayload(appointmentData) {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19);
        
        // Combine arrival date and time into ISO format
        const plannedStartTs = this.formatPlannedStartTime(appointmentData.shipped_date, appointmentData.arrival_time);

        return `<?xml version="1.0" encoding="utf-8"?>
<LgfData>
    <Header>
        <DocumentVersion>23C</DocumentVersion>
        <OriginSystem>str1234</OriginSystem>
        <ClientEnvCode>str1234</ClientEnvCode>
        <ParentCompanyCode>QATSTPC</ParentCompanyCode>
        <Entity>appointment</Entity>
        <TimeStamp>${timestamp}</TimeStamp>
        <MessageId>str1234</MessageId>
    </Header>
    <ListOfAppointments>
        <appointment>
             <facility_code>${headerData.facility_code}</facility_code>
                <company_code>${headerData.company_code}</company_code>
            <appt_nbr>${headerData.shipment_nbr}</appt_nbr>
            <load_nbr>${headerData.shipment_nbr}</load_nbr>
            <dock_type>I</dock_type>
            <action_code>CREATE</action_code>
            <preferred_dock_nbr></preferred_dock_nbr>
            <planned_start_ts>${plannedStartTs}</planned_start_ts>
            <duration>${appointmentData.unload_duration}</duration>
            <estimated_units></estimated_units>
            <carrier_info></carrier_info>
            <trailer_nbr></trailer_nbr>
            <load_type></load_type>
        </appointment>
    </ListOfAppointments>
</LgfData>`;
    }

    formatPlannedStartTime(shippedDate, arrivalTime) {
        // shippedDate is in YYYY-MM-DD format
        // arrivalTime is in HH:MM format (24hrs)
        // Return format: YYYY-MM-DDTHH:MM:00
        return `${shippedDate}T${arrivalTime}:00`;
    }
}