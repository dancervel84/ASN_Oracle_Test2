export class AuthService {
    constructor() {
        this.users = [
            { usuario: '125765', contraseña: '125765', compania: 'PROMOTORA INDUSTRIAL AZUCARERA SA DE CV' },
            { usuario: '190127', contraseña: '190127', compania: 'DEL CORONA & SCARDIGLI MEXICO SA DE CV' },
            { usuario: '91945', contraseña: '91945', compania: 'EUROPARTNERS MEXICO SA DE CV' },
            { usuario: '246215', contraseña: '246215', compania: 'GTL SUPPLY VALUE SAS DE CV' },
            { usuario: '182027', contraseña: '182027', compania: 'SOLVAY MEXICANA S. DE R.L. DE C.V.' },
            { usuario: '170506', contraseña: '170506', compania: 'ACUITY BRANDS LIGHTING DE MEXICO S DE RL DE CV' },
            { usuario: '249684', contraseña: '249684', compania: 'METAL MECANICA MACON S.A. DE C.V.' },
            { usuario: '96662', contraseña: '96662', compania: 'PHOENIX PACKAGING MEXICO SA DE CV' },
            { usuario: '250013', contraseña: '250013', compania: 'LOGISTICA MEXICANA PALCO' },
            { usuario: '93976', contraseña: '93976', compania: 'OMYA MEXICO S.A. DE C.V.' },
            { usuario: '218037', contraseña: '218037', compania: 'ETERNITY INTERNATIONAL FREIGHT FORWARDER MEXICO SA DE CV' },
            { usuario: '91286', contraseña: '91286', compania: 'CORPORATIVO ENCISO' },
            { usuario: '247105', contraseña: '247105', compania: 'L FREIGHT S SA DE CV' },
            { usuario: '233438', contraseña: '233438', compania: 'VALDEZ & WOODWARD SC' },
            { usuario: '246428', contraseña: '246428', compania: 'BREDSA SA DE CV' },
            { usuario: 'invitado', contraseña: 'invitado', compania: 'Invitado' }
        ];
        this.currentUser = null;
    }

    authenticate(usuario, contraseña) {
        const user = this.users.find(u => u.usuario === usuario && u.contraseña === contraseña);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}