import { ModalService } from './modal-service.js';

export class ItemAPIService {
    constructor() {
        this.apiUrl = 'https://ta35.wms.ocs.oraclecloud.com:443/grupocice_test/wms/api/init_stage_interface/';
        this.apiAuth = 'Basic bG9nZmlyZTpHcnVwb2NpY2UyMDI0';
        this.modal = new ModalService();
    }

    async sendItem(itemsData) {
        try {
            const xmlPayload = this.buildItemXMLPayload(itemsData);
            const bodyParams = new URLSearchParams({
                'entity': 'item',
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

    buildItemXMLPayload(itemsData) {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19);
        
        const itemsXML = itemsData.map(item => {
            return `
                <item>
                    <company_code>${item.company_code || ''}</company_code>
                    <item_alternate_code></item_alternate_code>
                    <part_a>${item.part_a || ''}</part_a>
                    <part_b></part_b>
                    <part_c></part_c>
                    <part_d></part_d>
                    <part_e></part_e>
                    <part_f></part_f>
                    <pre_pack_code></pre_pack_code>
                    <action_code>CREATE</action_code>
                    <description>${item.description || ''}</description>
                    <barcode>${item.barcode || ''}</barcode>
                    <unit_cost>0</unit_cost>
                    <unit_length>0</unit_length>
                    <unit_width>0</unit_width>
                    <unit_height>0</unit_height>
                    <unit_weight>1</unit_weight>
                    <unit_volume>0</unit_volume>
                    <hazmat></hazmat>
                    <recv_type></recv_type>
                    <ob_lpn_type></ob_lpn_type>
                    <catch_weight_method></catch_weight_method>
                    <order_consolidation_attr></order_consolidation_attr>
                    <season_code></season_code>
                    <brand_code></brand_code>
                    <cust_attr_1></cust_attr_1>
                    <cust_attr_2></cust_attr_2>
                    <retail_price>0</retail_price>
                    <net_cost>0</net_cost>
                    <currency_code></currency_code>
                    <std_pack_qty>10</std_pack_qty>
                    <std_pack_length>0</std_pack_length>
                    <std_pack_width>0</std_pack_width>
                    <std_pack_height>0</std_pack_height>
                    <std_pack_weight>0</std_pack_weight>
                    <std_pack_volume>0</std_pack_volume>
                    <std_case_qty>0</std_case_qty>
                    <max_case_qty>${item.max_case_qty || ''}</max_case_qty>
                    <std_case_length>0</std_case_length>
                    <std_case_width>0</std_case_width>
                    <std_case_height>0</std_case_height>
                    <std_case_weight>0</std_case_weight>
                    <std_case_volume>0</std_case_volume>
                    <dimension1>0</dimension1>
                    <dimension2>0</dimension2>
                    <dimension3>0</dimension3>
                    <hierarchy1_code></hierarchy1_code>
                    <hierarchy1_description></hierarchy1_description>
                    <hierarchy2_code></hierarchy2_code>
                    <hierarchy2_description></hierarchy2_description>
                    <hierarchy3_code></hierarchy3_code>
                    <hierarchy3_description></hierarchy3_description>
                    <hierarchy4_code></hierarchy4_code>
                    <hierarchy4_description></hierarchy4_description>
                    <hierarchy5_code></hierarchy5_code>
                    <hierarchy5_description></hierarchy5_description>
                    <group_code></group_code>
                    <group_description></group_description>
                    <external_style></external_style>
                    <vas_group_code></vas_group_code>
                    <short_descr></short_descr>
                    <putaway_type></putaway_type>
                    <conveyable></conveyable>
                    <stackability_code></stackability_code>
                    <sortable></sortable>
                    <min_dispatch_uom></min_dispatch_uom>
                    <product_life>${item.product_life || ''}</product_life>
                    <percent_acceptable_product_life>0</percent_acceptable_product_life>
                    <lpns_per_tier>${item.lpns_per_tier || ''}</lpns_per_tier>
                    <tiers_per_pallet>${item.tiers_per_pallet || ''}</tiers_per_pallet>
                    <velocity_code></velocity_code>
                    <req_batch_nbr_flg>${item.req_batch_nbr_flg || ''}</req_batch_nbr_flg>
                    <serial_nbr_tracking></serial_nbr_tracking>
                    <regularity_code></regularity_code>
                    <harmonized_tariff_code></harmonized_tariff_code>
                    <harmonized_tariff_description></harmonized_tariff_description>
                    <full_oblpn_type></full_oblpn_type>
                    <case_oblpn_type></case_oblpn_type>
                    <pack_oblpn_type></pack_oblpn_type>
                    <description_2>${item.description_2 || ''}</description_2>
                    <description_3>ESENTTIA</description_3>
                    <invn_attr_a_tracking></invn_attr_a_tracking>
                    <invn_attr_a_dflt_value></invn_attr_a_dflt_value>
                    <invn_attr_b_tracking></invn_attr_b_tracking>
                    <invn_attr_b_dflt_value></invn_attr_b_dflt_value>
                    <invn_attr_c_tracking></invn_attr_c_tracking>
                    <invn_attr_c_dflt_value></invn_attr_c_dflt_value>
                    <nmfc_code></nmfc_code>
                    <conversion_factor></conversion_factor>
                    <invn_attr_d_tracking></invn_attr_d_tracking>
                    <invn_attr_e_tracking></invn_attr_e_tracking>
                    <invn_attr_f_tracking></invn_attr_f_tracking>
                    <invn_attr_g_tracking></invn_attr_g_tracking>
                    <host_aware_item_flg></host_aware_item_flg>
                    <packing_tolerance_percent></packing_tolerance_percent>
                    <un_number></un_number>
                    <un_class></un_class>
                    <un_description></un_description>
                    <packing_group></packing_group>
                    <proper_shipping_name></proper_shipping_name>
                    <excepted_qty_instr></excepted_qty_instr>
                    <limited_qty_flg></limited_qty_flg>
                    <fulldg_flg></fulldg_flg>
                    <hazard_statement></hazard_statement>
                    <shipping_temperature_instr></shipping_temperature_instr>
                    <carrier_commodity_description></carrier_commodity_description>
                    <hazmat_packaging_description></hazmat_packaging_description>
                    <shipping_conversion_factor></shipping_conversion_factor>
                    <shipping_uom></shipping_uom>
                    <handle_decimal_qty_flg></handle_decimal_qty_flg>
                    <dummy_sku_flg></dummy_sku_flg>
                    <pack_with_wave_flg></pack_with_wave_flg>
                    <batch_handling_receiving></batch_handling_receiving>
                    <expiry_handling_receiving></expiry_handling_receiving>
                    <primary_uom_code>${item.primary_uom_code || ''}</primary_uom_code>
                    <case_uom_code></case_uom_code>
                    <pack_uom_code>${item.pack_uom_code || ''}</pack_uom_code>
                    <weight_uom_code></weight_uom_code>
                    <volume_uom_code></volume_uom_code>
                    <dimension_uom_code></dimension_uom_code>
                    <dimension_validation>0</dimension_validation>
                </item>
            `;
        }).join('');

        return `<?xml version="1.0" encoding="utf-8"?>
<LgfData>
    <Header>
        <DocumentVersion>23C</DocumentVersion>
        <OriginSystem>str1234</OriginSystem>
        <ClientEnvCode>str1234</ClientEnvCode>
        <ParentCompanyCode>CICEMTY</ParentCompanyCode>
        <Entity>item</Entity>
        <TimeStamp>${timestamp}</TimeStamp>
        <MessageId>str1234</MessageId>
    </Header>
    <ListOfItems>
        ${itemsXML}
    </ListOfItems>
</LgfData>`;
    }
}