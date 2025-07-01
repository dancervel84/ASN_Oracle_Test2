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
                
                <!-- Items Section -->
                <div>
                    <div class="flex flex-wrap gap-4 justify-between items-center border-b pb-2 mb-6">
                        <h2 class="text-xl font-semibold text-gray-700">Artículos a Registrar</h2>
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