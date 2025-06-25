export function createOrderFormHTML() {
    return `
        <div class="main-container">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Interfaz de Órdenes de Venta</h1>
                <p class="mt-2 text-md text-gray-500">Formulario para registrar nuevas órdenes de venta en WMS.</p>
            </div>

            <!-- Main Form -->
            <form id="order-form" class="space-y-8 bg-white p-8 rounded-lg shadow-lg">
                
                <!-- General Data Section -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">Datos Generales de Orden de Venta</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="facility_code" class="form-label">Almacén <span class="text-red-500">*</span></label>
                            <input type="text" id="facility_code" name="facility_code" class="form-input" required>
                        </div>
                        <div>
                            <label for="company_code" class="form-label">Cuenta <span class="text-red-500">*</span></label>
                            <input type="text" id="company_code" name="company_code" class="form-input" required>
                        </div>
                        <div>
                            <label for="order_nbr" class="form-label">Pedido <span class="text-red-500">*</span></label>
                            <input type="text" id="order_nbr" name="order_nbr" class="form-input" required>
                        </div>
                        <div>
                            <label for="ord_date" class="form-label">Fecha de Solicitud <span class="text-red-500">*</span></label>
                            <input type="date" id="ord_date" name="ord_date" class="form-input" required>
                        </div>
                        <div>
                            <label for="req_ship_date" class="form-label">Fecha Requerida <span class="text-red-500">*</span></label>
                            <input type="date" id="req_ship_date" name="req_ship_date" class="form-input" required>
                        </div>
                        <div>
                            <label for="dest_facility_code" class="form-label">Destino <span class="text-red-500">*</span></label>
                            <input type="text" id="dest_facility_code" name="dest_facility_code" class="form-input" required>
                        </div>
                        <div>
                            <label for="ref_nbr" class="form-label">Referencia <span class="text-red-500">*</span></label>
                            <input type="text" id="ref_nbr" name="ref_nbr" class="form-input" required>
                        </div>
                    </div>
                </div>

                <!-- Items Section -->
                <div>
                    <div class="flex flex-wrap gap-4 justify-between items-center border-b pb-2 mb-6">
                        <h2 class="text-xl font-semibold text-gray-700">Artículos del Pedido</h2>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" id="upload-order-csv-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13H5.5z" />
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                </svg>
                                Cargar desde CSV/Excel
                            </button>
                            <input type="file" id="order-csv-file-input" class="hidden" accept=".csv,.xlsx,.xls">
                            <button type="button" id="add-order-item-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                </svg>
                                Agregar Artículo
                            </button>
                        </div>
                    </div>
                    <div id="order-item-lines-container" class="space-y-4">
                        <!-- Item lines will be inserted here dynamically -->
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-5">
                    <div class="flex justify-end">
                        <button type="submit" class="btn-primary">
                            Enviar Orden a WMS
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
}