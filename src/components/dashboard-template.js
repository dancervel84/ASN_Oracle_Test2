export function createDashboardHTML(user) {
    return `
        <div class="min-h-screen bg-gray-100">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <h1 class="text-xl font-semibold text-gray-900">Ingresar Datos WMS-CICE</h1>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <div class="text-right">
                                <div class="text-sm font-medium text-gray-900">Usuario: ${user.usuario}</div>
                                <div class="text-xs text-gray-500 max-w-xs truncate" title="${user.compania}">
                                    ${user.compania}
                                </div>
                            </div>
                            <button id="logout-btn" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-900">Panel de Control</h2>
                        <p class="mt-2 text-lg text-gray-600">Seleccione el módulo al que desea acceder</p>
                    </div>

                    <!-- Navigation Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Items Module -->
                        <div class="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="p-6">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-medium text-gray-900">Items</h3>
                                        <p class="text-sm text-gray-500">Gestión de artículos</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button class="nav-btn w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition duration-150 ease-in-out" data-module="items">
                                        Acceder al módulo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ASN Module -->
                        <div class="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="p-6">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM19.5 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-medium text-gray-900">ASN</h3>
                                        <p class="text-sm text-gray-500">Interfaz de Entrada de Embarques</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button class="nav-btn w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition duration-150 ease-in-out" data-module="asn">
                                        Acceder al módulo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Orders Module -->
                        <div class="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="p-6">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-medium text-gray-900">Ordenes</h3>
                                        <p class="text-sm text-gray-500">Gestión de órdenes</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button class="nav-btn w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition duration-150 ease-in-out" data-module="orders">
                                        Acceder al módulo
                                    </button>
                                </div>
                            </div>
                        </div>

                        /*<!-- Reports Module -->
                        <div class="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="p-6">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-medium text-gray-900">Reportes</h3>
                                        <p class="text-sm text-gray-500">Informes y estadísticas</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button class="nav-btn w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md transition duration-150 ease-in-out" data-module="reports">*/
                                        Acceder al módulo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}