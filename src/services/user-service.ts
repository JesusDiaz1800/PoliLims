

export interface User {
    username: string;
    fullName: string;
    role: 'Jefe de Calidad' | 'Ing. Analista de Calidad' | 'Analista de Calidad' | 'Inspector de Calidad' | 'Administrador' | 'Cliente';
    initials: string;
    avatarUrl: string;
}

const users: Record<string, User> = {
    "jdiaz": {
        username: "jdiaz",
        fullName: "Jesus Diaz",
        role: "Ing. Analista de Calidad",
        initials: "JD",
        avatarUrl: "https://placehold.co/40x40/E6E16B/313437?text=JD"
    },
    "mmiranda": {
        username: "mmiranda",
        fullName: "Maximiliano Miranda",
        role: "Ing. Analista de Calidad",
        initials: "MM",
        avatarUrl: "https://placehold.co/40x40/B39E83/313437?text=MM"
    },
    "afigueroa": {
        username: "afigueroa",
        fullName: "Antonia Figueroa",
        role: "Analista de Calidad",
        initials: "AF",
        avatarUrl: "https://placehold.co/40x40/D18E8E/313437?text=AF"
    },
    "rcordova": {
        username: "rcordova",
        fullName: "Robinson Córdova",
        role: "Analista de Calidad",
        initials: "RC",
        avatarUrl: "https://placehold.co/40x40/70A1AF/313437?text=RC"
    },
    "bvasquez": {
        username: "bvasquez",
        fullName: "Bryan Vásquez",
        role: "Analista de Calidad",
        initials: "BV",
        avatarUrl: "https://placehold.co/40x40/9D88B3/313437?text=BV"
    },
    "jefe.calidad": {
        username: "jefe.calidad",
        fullName: "Victor Lutz",
        role: "Jefe de Calidad",
        initials: "VL",
        avatarUrl: "https://placehold.co/40x40/E6B46B/313437?text=VL"
    },
     "eibanez": {
        username: "eibanez",
        fullName: "Elias Ibañez",
        role: "Inspector de Calidad",
        initials: "EI",
        avatarUrl: "https://placehold.co/40x40/6BE69C/313437?text=EI"
    },
    "cmontellano": {
        username: "cmontellano",
        fullName: "Cristian Montellano",
        role: "Inspector de Calidad",
        initials: "CM",
        avatarUrl: "https://placehold.co/40x40/6BA7E6/313437?text=CM"
    },
    "dpalma": {
        username: "dpalma",
        fullName: "Daniel Palma",
        role: "Inspector de Calidad",
        initials: "DP",
        avatarUrl: "https://placehold.co/40x40/E66BA7/313437?text=DP"
    },
    "lparada": {
        username: "lparada",
        fullName: "Luis Parada",
        role: "Inspector de Calidad",
        initials: "LP",
        avatarUrl: "https://placehold.co/40x40/E6826B/313437?text=LP"
    },
    "admin": {
        username: "admin",
        fullName: "Administrador del Sistema",
        role: "Administrador",
        initials: "AD",
        avatarUrl: "https://placehold.co/40x40/888/fff?text=AD"
    },
    "cliente": {
        username: "cliente",
        fullName: "Cliente de Ejemplo",
        role: "Cliente",
        initials: "CE",
        avatarUrl: "https://placehold.co/40x40/3498db/fff?text=CE"
    }
};

export async function findUserByUsername(username: string): Promise<User> {
    // Devuelve un usuario predeterminado si no se encuentra el especificado.
    return users[username] || users["jefe.calidad"];
}

export async function getAllUsers(): Promise<User[]> {
    return Object.values(users);
}
