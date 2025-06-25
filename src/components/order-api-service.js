import { ModalService } from './modal-service.js';

export class OrderAPIService {
    constructor() {
        this.apiUrl = 'https://ta35.wms.ocs.oraclecloud.com:443/grupocice_test/wms/api/init_stage_interface/';
        this.apiAuth = 'Basic bG9nZmlyZTpHcnVwb2NpY2UyMDI0';
        this.modal = new ModalService();
    }

    async sendOrder(headerData, itemLinesData) {
        try {
            const xmlPayload = this.buildOrderXMLPayload(headerData, itemLinesData);
            const bodyParams = new URLSearchParams({
                'entity': 'order',
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

    buildOrderXMLPayload(headerData, itemLinesData) {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19);
        
        const itemDetailsXML = itemLinesData.map((item, index) => {
            return `
                <order_dtl>
                    <seq_nbr>${item.seq_nbr || (index + 1)}</seq_nbr>
                    <item_alternate_code>${item.item_alternate_code || ''}</item_alternate_code>
                    <item_part_a></item_part_a>
                    <item_part_b></item_part_b>
                    <item_part_c></item_part_c>
                    <item_part_d></item_part_d>
                    <item_part_e></item_part_e>
                    <item_part_f></item_part_f>
                    <pre_pack_code></pre_pack_code>
                    <pre_pack_ratio></pre_pack_ratio>
                    <pre_pack_ratio_seq></pre_pack_ratio_seq>
                    <pre_pack_total_units></pre_pack_total_units>
                    <ord_qty>${item.ord_qty || ''}</ord_qty>
                    <req_cntr_nbr>${item.req_cntr_nbr || ''}</req_cntr_nbr>
                    <action_code>CREATE</action_code>
                    <batch_nbr>${item.batch_nbr || ''}</batch_nbr>
                    <invn_attr_a></invn_attr_a>
                    <invn_attr_b></invn_attr_b>
                    <invn_attr_c></invn_attr_c>
                    <cost>0</cost>
                    <sale_price>0</sale_price>
                    <po_nbr></po_nbr>
                    <shipment_nbr></shipment_nbr>
                    <dest_facility_attr_a></dest_facility_attr_a>
                    <dest_facility_attr_b></dest_facility_attr_b>
                    <dest_facility_attr_c></dest_facility_attr_c>
                    <ref_nbr_1></ref_nbr_1>
                    <host_ob_lpn_nbr></host_ob_lpn_nbr>
                    <spl_instr></spl_instr>
                    <vas_activity_code></vas_activity_code>
                    <cust_field_1></cust_field_1>
                    <cust_field_2></cust_field_2>
                    <cust_field_3></cust_field_3>
                    <cust_field_4></cust_field_4>
                    <cust_field_5></cust_field_5>
                    <voucher_nbr></voucher_nbr>
                    <voucher_amount></voucher_amount>
                    <voucher_exp_date></voucher_exp_date>
                    <req_pallet_nbr></req_pallet_nbr>
                    <lock_code></lock_code>
                    <serial_nbr></serial_nbr>
                    <item_barcode></item_barcode>
                    <uom></uom>
                    <cust_date_1></cust_date_1>
                    <cust_date_2></cust_date_2>
                    <cust_date_3></cust_date_3>
                    <cust_date_4></cust_date_4>
                    <cust_date_5></cust_date_5>
                    <cust_number_1></cust_number_1>
                    <cust_number_2></cust_number_2>
                    <cust_number_3></cust_number_3>
                    <cust_number_4></cust_number_4>
                    <cust_number_5></cust_number_5>
                    <cust_decimal_1></cust_decimal_1>
                    <cust_decimal_2></cust_decimal_2>
                    <cust_decimal_3></cust_decimal_3>
                    <cust_decimal_4></cust_decimal_4>
                    <cust_decimal_5></cust_decimal_5>
                    <cust_short_text_1></cust_short_text_1>
                    <cust_short_text_2></cust_short_text_2>
                    <cust_short_text_3></cust_short_text_3>
                    <cust_short_text_4></cust_short_text_4>
                    <cust_short_text_5></cust_short_text_5>
                    <cust_short_text_6></cust_short_text_6>
                    <cust_short_text_7></cust_short_text_7>
                    <cust_short_text_8></cust_short_text_8>
                    <cust_short_text_9></cust_short_text_9>
                    <cust_short_text_10></cust_short_text_10>
                    <cust_short_text_11></cust_short_text_11>
                    <cust_short_text_12></cust_short_text_12>
                    <cust_long_text_1></cust_long_text_1>
                    <cust_long_text_2></cust_long_text_2>
                    <cust_long_text_3></cust_long_text_3>
                    <invn_attr_d></invn_attr_d>
                    <invn_attr_e></invn_attr_e>
                    <invn_attr_f></invn_attr_f>
                    <invn_attr_g></invn_attr_g>
                    <ship_request_line></ship_request_line>
                    <unit_declared_value></unit_declared_value>
                    <invn_attr_h></invn_attr_h>
                    <invn_attr_i></invn_attr_i>
                    <invn_attr_j></invn_attr_j>
                    <invn_attr_k></invn_attr_k>
                    <invn_attr_l></invn_attr_l>
                    <invn_attr_m></invn_attr_m>
                    <invn_attr_n></invn_attr_n>
                    <invn_attr_o></invn_attr_o>
                    <erp_source_line_ref></erp_source_line_ref>
                    <erp_source_shipment_ref></erp_source_shipment_ref>
                    <erp_fulfillment_line_ref></erp_fulfillment_line_ref>
                    <sales_order_line_ref></sales_order_line_ref>
                    <sales_order_schedule_ref></sales_order_schedule_ref>
                    <min_shipping_tolerance_percentage></min_shipping_tolerance_percentage>
                    <max_shipping_tolerance_percentage></max_shipping_tolerance_percentage>
                    <uom_code></uom_code>
                </order_dtl>
            `;
        }).join('');

        return `<?xml version="1.0" encoding="utf-8"?>
<LgfData>
    <Header>
        <DocumentVersion>23C</DocumentVersion>
        <OriginSystem>QA</OriginSystem>
        <ClientEnvCode>CICEMX2</ClientEnvCode>
        <ParentCompanyCode>GRUPOCICE</ParentCompanyCode>
        <Entity>order</Entity>
        <TimeStamp>${timestamp}</TimeStamp>
        <MessageId>SalesOrder</MessageId>
    </Header>
    <ListOfOrders>
        <order>
            <order_hdr>
                <facility_code>${headerData.facility_code}</facility_code>
                <company_code>${headerData.company_code}</company_code>
                <order_nbr>${headerData.order_nbr}</order_nbr>
                <order_type>VTA</order_type>
                <ord_date>${headerData.ord_date}</ord_date>
                <exp_date></exp_date>
                <req_ship_date>${headerData.req_ship_date}</req_ship_date>
                <dest_facility_code>${headerData.dest_facility_code}</dest_facility_code>
                <cust_name></cust_name>
                <cust_addr></cust_addr>
                <cust_addr2></cust_addr2>
                <cust_addr3></cust_addr3>
                <ref_nbr>${headerData.ref_nbr}</ref_nbr>
                <action_code>CREATE</action_code>
                <route_nbr></route_nbr>
                <cust_city></cust_city>
                <cust_state></cust_state>
                <cust_zip></cust_zip>
                <cust_country></cust_country>
                <cust_phone_nbr></cust_phone_nbr>
                <cust_email></cust_email>
                <cust_contact></cust_contact>
                <cust_nbr></cust_nbr>
                <shipto_facility_code></shipto_facility_code>
                <shipto_name></shipto_name>
                <shipto_addr></shipto_addr>
                <shipto_addr2></shipto_addr2>
                <shipto_addr3></shipto_addr3>
                <shipto_city></shipto_city>
                <shipto_state></shipto_state>
                <shipto_zip></shipto_zip>
                <shipto_country></shipto_country>
                <shipto_phone_nbr></shipto_phone_nbr>
                <shipto_email></shipto_email>
                <shipto_contact></shipto_contact>
                <dest_company_code></dest_company_code>
                <priority></priority>
                <ship_via_code></ship_via_code>
                <carrier_account_nbr></carrier_account_nbr>
                <payment_method></payment_method>
                <host_allocation_nbr></host_allocation_nbr>
                <customer_po_nbr></customer_po_nbr>
                <sales_order_nbr></sales_order_nbr>
                <sales_channel></sales_channel>
                <dest_dept_nbr></dest_dept_nbr>
                <start_ship_date></start_ship_date>
                <stop_ship_date></stop_ship_date>
                <spl_instr></spl_instr>
                <vas_group_code></vas_group_code>
                <currency_code></currency_code>
                <stage_location_barcode></stage_location_barcode>
                <cust_field_1></cust_field_1>
                <cust_field_2></cust_field_2>
                <cust_field_3></cust_field_3>
                <cust_field_4></cust_field_4>
                <cust_field_5></cust_field_5>
                <ob_lpn_type></ob_lpn_type>
                <gift_msg></gift_msg>
                <sched_ship_date></sched_ship_date>
                <customer_po_type></customer_po_type>
                <customer_vendor_code></customer_vendor_code>
                <cust_date_1></cust_date_1>
                <cust_date_2></cust_date_2>
                <cust_date_3></cust_date_3>
                <cust_date_4></cust_date_4>
                <cust_date_5></cust_date_5>
                <cust_number_1></cust_number_1>
                <cust_number_2></cust_number_2>
                <cust_number_3></cust_number_3>
                <cust_number_4></cust_number_4>
                <cust_number_5></cust_number_5>
                <cust_decimal_1></cust_decimal_1>
                <cust_decimal_2></cust_decimal_2>
                <cust_decimal_3></cust_decimal_3>
                <cust_decimal_4></cust_decimal_4>
                <cust_decimal_5></cust_decimal_5>
                <cust_short_text_1></cust_short_text_1>
                <cust_short_text_2></cust_short_text_2>
                <cust_short_text_3></cust_short_text_3>
                <cust_short_text_4></cust_short_text_4>
                <cust_short_text_5></cust_short_text_5>
                <cust_short_text_6></cust_short_text_6>
                <cust_short_text_7></cust_short_text_7>
                <cust_short_text_8></cust_short_text_8>
                <cust_short_text_9></cust_short_text_9>
                <cust_short_text_10></cust_short_text_10>
                <cust_short_text_11></cust_short_text_11>
                <cust_short_text_12></cust_short_text_12>
                <cust_long_text_1></cust_long_text_1>
                <cust_long_text_2></cust_long_text_2>
                <cust_long_text_3></cust_long_text_3>
                <order_nbr_to_replace></order_nbr_to_replace>
                <lpn_type_class></lpn_type_class>
                <billto_carrier_account_nbr></billto_carrier_account_nbr>
                <duties_carrier_account_nbr></duties_carrier_account_nbr>
                <duties_payment_method></duties_payment_method>
                <customs_broker_contact></customs_broker_contact>
                <erp_source_hdr_ref></erp_source_hdr_ref>
                <erp_source_system_ref></erp_source_system_ref>
                <group_ref></group_ref>
                <externally_planned_load_flg></externally_planned_load_flg>
                <carrier_code></carrier_code>
                <carrier_type></carrier_type>
                <std_carrier_service_code></std_carrier_service_code>
            </order_hdr>
            ${itemDetailsXML}
        </order>
    </ListOfOrders>
</LgfData>`;
    }
}