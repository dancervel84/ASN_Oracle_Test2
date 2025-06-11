export function createLoginHTML() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                        <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900">Sistema WMS</h2>
                    <p class="mt-2 text-sm text-gray-600">Ingrese sus credenciales para acceder</p>
                </div>
                
                <form id="login-form" class="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg">
                    <div class="space-y-4">
                        <div>
                            <label for="usuario" class="form-label">Usuario</label>
                            <input id="usuario" name="usuario" type="text" required 
                                   class="form-input" placeholder="Ingrese su usuario">
                        </div>
                        <div>
                            <label for="contraseña" class="form-label">Contraseña</label>
                            <input id="contraseña" name="contraseña" type="password" required 
                                   class="form-input" placeholder="Ingrese su contraseña">
                        </div>
                    </div>

                    <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        <div class="flex">
                            <svg class="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                            <span>Usuario o contraseña incorrectos</span>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full">
                        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    `;
}