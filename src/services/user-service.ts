
/**
 * @interface User
 * @description Defines the structure of a user object in the application.
 */
export interface User {
    username: string;
    fullName: string;
    role: 'Jefe de Calidad' | 'Ing. Analista de Calidad' | 'Analista de Calidad' | 'Inspector de Calidad' | 'Administrador' | 'Cliente';
    initials: string;
    avatarUrl: string;
}

/**
 * @const users
 * @description A mock database of users for the prototype. In a real application, this would be
 * replaced with a call to an authentication service or a user database.
 */
const users: Record<string, User> = {
    "main_dashboard_user": {
        username: "main_dashboard_user",
        fullName: "Usuario Principal",
        role: "Jefe de Calidad",
        initials: "UP",
        avatarUrl: "https://placehold.co/40x40/00E5FF/0F172A?text=UP"
    },
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

/**
 * @function findUserByUsername
 * @description Finds a user by their username from the mock user database.
 * If the user is not found, it returns a default user ('jefe.calidad').
 * @param {string} username - The username to search for.
 * @returns {Promise<User>} A promise that resolves to the found user object.
 */
export async function findUserByUsername(username: string): Promise<User> {
    // This simulates an async API call to fetch a user.
    return users[username] || users["main_dashboard_user"];
}

/**
 * @function getAllUsers
 * @description Retrieves a list of all users from the mock user database.
 * @returns {Promise<User[]>} A promise that resolves to an array of all user objects.
 */
export async function getAllUsers(): Promise<User[]> {
    // This simulates an async API call to fetch all users.
    return Object.values(users);
}

    