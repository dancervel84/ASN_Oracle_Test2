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
                    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">Datos del Artículo</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="company_code" class="form-label">Cuenta <span class="text-red-500">*</span></label>
                            <input type="text" id="company_code" name="company_code" class="form-input" required>
                        </div>
                        <div>
                            <label for="part_a" class="form-label">Artículo <span class="text-red-500">*</span></label>
                            <input type="text" id="part_a" name="part_a" class="form-input" required>
                        </div>
                        <div class="md:col-span-2">
                            <label for="description" class="form-label">Descripción <span class="text-red-500">*</span></label>
                            <input type="text" id="description" name="description" class="form-input" required>
                        </div>
                        <div>
                            <label for="barcode" class="form-label">Código de Barras <span class="text-red-500">*</span></label>
                            <input type="text" id="barcode" name="barcode" class="form-input" required>
                        </div>
                        <div>
                            <label for="max_case_qty" class="form-label">Tot Cajas/Bultos <span class="text-red-500">*</span></label>
                            <input type="number" id="max_case_qty" name="max_case_qty" class="form-input" min="1" required>
                        </div>
                        <div>
                            <label for="lpns_per_tier" class="form-label">Cajas x Cama <span class="text-red-500">*</span></label>
                            <input type="number" id="lpns_per_tier" name="lpns_per_tier" class="form-input" min="1" required>
                        </div>
                        <div>
                            <label for="tiers_per_pallet" class="form-label">Camas x LPN <span class="text-red-500">*</span></label>
                            <input type="number" id="tiers_per_pallet" name="tiers_per_pallet" class="form-input" min="1" required>
                        </div>
                        <div class="md:col-span-2">
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center">
                                    <input type="checkbox" id="req_batch_nbr_flg" name="req_batch_nbr_flg" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                    <label for="req_batch_nbr_flg" class="ml-2 block text-sm font-medium text-gray-700">
                                        Lote requerido
                                    </label>
                                </div>
                                <div class="flex-1" id="product_life_container" style="display: none;">
                                    <label for="product_life" class="form-label">Días de Vida</label>
                                    <input type="number" id="product_life" name="product_life" class="form-input" min="1">
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label for="description_2" class="form-label">Sub-Cuenta <span class="text-red-500">*</span></label>
                            <input type="text" id="description_2" name="description_2" class="form-input" required>
                        </div>
                    </div>
                </div>

                <!-- Items Section -->
                <div>
                    <div class="flex flex-wrap gap-4 justify-between items-center border-b pb-2 mb-6">
                        <h2 class="text-xl font-semibold text-gray-700">Carga Masiva de Artículos</h2>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" id="upload-item-csv-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13H5.5z" />
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                </svg>
                                Cargar desde CSV/Excel
                            </button>
                            <input type="file" id="item-csv-file-input" class="hidden" accept=".csv,.xlsx,.xls">
                        </div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-md">
                        <p class="text-sm text-gray-600 mb-2">
                            <strong>Formato del archivo CSV/Excel:</strong>
                        </p>
                        <p class="text-xs text-gray-500">
                            Cuenta, Artículo, Descripción, Código de Barras, Tot Cajas/Bultos, Cajas x Cama, Camas x LPN, Lote requerido (yes/no), Días de Vida, Sub-Cuenta
                        </p>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-5">
                    <div class="flex justify-end">
                        <button type="submit" class="btn-primary">
                            Enviar Artículo a WMS
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
}