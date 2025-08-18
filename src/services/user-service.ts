

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
    "jdiaz": {
        username: "jdiaz",
        fullName: "Jesus Diaz",
        role: "Ing. Analista de Calidad",
        initials: "JD",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "mmiranda": {
        username: "mmiranda",
        fullName: "Maximiliano Miranda",
        role: "Ing. Analista de Calidad",
        initials: "MM",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "afigueroa": {
        username: "afigueroa",
        fullName: "Antonia Figueroa",
        role: "Analista de Calidad",
        initials: "AF",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "rcordova": {
        username: "rcordova",
        fullName: "Robinson Córdova",
        role: "Analista de Calidad",
        initials: "RC",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "bvasquez": {
        username: "bvasquez",
        fullName: "Bryan Vásquez",
        role: "Analista de Calidad",
        initials: "BV",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "jefe.calidad": {
        username: "jefe.calidad",
        fullName: "Victor Lutz",
        role: "Jefe de Calidad",
        initials: "VL",
        avatarUrl: "https://placehold.co/40x40.png"
    },
     "eibanez": {
        username: "eibanez",
        fullName: "Elias Ibañez",
        role: "Inspector de Calidad",
        initials: "EI",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "cmontellano": {
        username: "cmontellano",
        fullName: "Cristian Montellano",
        role: "Inspector de Calidad",
        initials: "CM",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "dpalma": {
        username: "dpalma",
        fullName: "Daniel Palma",
        role: "Inspector de Calidad",
        initials: "DP",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "lparada": {
        username: "lparada",
        fullName: "Luis Parada",
        role: "Inspector de Calidad",
        initials: "LP",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "admin": {
        username: "admin",
        fullName: "Administrador del Sistema",
        role: "Administrador",
        initials: "AD",
        avatarUrl: "https://placehold.co/40x40.png"
    },
    "cliente": {
        username: "cliente",
        fullName: "Cliente de Ejemplo",
        role: "Cliente",
        initials: "CE",
        avatarUrl: "https://placehold.co/40x40.png"
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
    return users[username] || users["jefe.calidad"];
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
