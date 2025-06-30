export function createItemFormHTML() {
    return `
        <div class="main-container">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Interfaz de Artículos</h1>
                <p class="mt-2 text-md text-gray-500">Formulario para registrar nuevos artículos en WMS.</p>
            </div>

            <!-- Main Form -->
            <form id="item-form" class="space-y-8 bg-white p-8 rounded-lg shadow-lg">
                
                <!-- General Data Section -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">Datos Generales del Artículo</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="company_code" class="form-label">Cuenta <span class="text-red-500">*</span></label>
                            <input type="text" id="company_code" name="company_code" class="form-input" required>
                        </div>
                        <div>
                            <label for="part_a" class="form-label">Artículo <span class="text-red-500">*</span></label>
                            <input type="text" id="part_a" name="part_a" class="form-input" required>
                        </div>
                        <div>
                            <label for="description" class="form-label">Descripción <span class="text-red-500">*</span></label>
                            <input type="text" id="description" name="description" class="form-input" required>
                        </div>
                        <div>
                            <label for="barcode" class="form-label">Código de Barras</label>
                            <input type="text" id="barcode" name="barcode" class="form-input">
                        </div>
                        <div>
                            <label for="max_case_qty" class="form-label">Tot Cajas/Bultos</label>
                            <input type="number" id="max_case_qty" name="max_case_qty" class="form-input" min="0">
                        </div>
                        <div>
                            <label for="lpns_per_tier" class="form-label">Cajas x Cama</label>
                            <input type="number" id="lpns_per_tier" name="lpns_per_tier" class="form-input" min="0">
                        </div>
                        <div>
                            <label for="tiers_per_pallet" class="form-label">Camas x LPN</label>
                            <input type="number" id="tiers_per_pallet" name="tiers_per_pallet" class="form-input" min="0">
                        </div>
                        <div>
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="req_batch_nbr_flg" name="req_batch_nbr_flg" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                <label for="req_batch_nbr_flg" class="form-label mb-0">Lote Requerido</label>
                            </div>
                        </div>
                        <div id="product_life_container" class="hidden">
                            <label for="product_life" class="form-label">Días de Vida</label>
                            <input type="number" id="product_life" name="product_life" class="form-input" min="0">
                        </div>
                        <div>
                            <label for="description_2" class="form-label">Sub-Cuenta</label>
                            <input type="text" id="description_2" name="description_2" class="form-input">
                        </div>
                        <div>
                            <label for="primary_uom_code" class="form-label">UOM Primario</label>
                            <input type="text" id="primary_uom_code" name="primary_uom_code" class="form-input">
                        </div>
                        <div>
                            <label for="pack_uom_code" class="form-label">UOM Empaque</label>
                            <input type="text" id="pack_uom_code" name="pack_uom_code" class="form-input">
                        </div>
                    </div>
                </div>

                <!-- Items Section -->
                <div>
                    <div class="flex flex-wrap gap-4 justify-between items-center border-b pb-2 mb-6">
                        <h2 class="text-xl font-semibold text-gray-700">Artículos Adicionales</h2>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" id="upload-item-csv-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13H5.5z" />
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                </svg>
                                Cargar desde CSV/Excel
                            </button>
                            <input type="file" id="item-csv-file-input" class="hidden" accept=".csv,.xlsx,.xls">
                            <button type="button" id="add-item-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                </svg>
                                Agregar Artículo
                            </button>
                        </div>
                    </div>
                    <div id="item-lines-container" class="space-y-4">
                        <!-- Item lines will be inserted here dynamically -->
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-5">
                    <div class="flex justify-end">
                        <button type="submit" class="btn-primary">
                            Enviar Artículos a WMS
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
}