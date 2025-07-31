
export interface User {
    username: string;
    fullName: string;
    role: string;
    initials: string;
    avatarUrl: string;
}

const users: Record<string, User> = {
    "jesus.diaz": {
        username: "jesus.diaz",
        fullName: "Jesus Diaz",
        role: "Ing. Analista de Calidad",
        initials: "JD",
        avatarUrl: "https://placehold.co/40x40/E6E16B/313437?text=JD"
    },
    "maximiliano.miranda": {
        username: "maximiliano.miranda",
        fullName: "Maximiliano Miranda",
        role: "Ing. Analista de Calidad",
        initials: "MM",
        avatarUrl: "https://placehold.co/40x40/B39E83/313437?text=MM"
    },
    "antonia.figueroa": {
        username: "antonia.figueroa",
        fullName: "Antonia Figueroa",
        role: "Analista de Calidad",
        initials: "AF",
        avatarUrl: "https://placehold.co/40x40/D18E8E/313437?text=AF"
    },
    "robinson.cordova": {
        username: "robinson.cordova",
        fullName: "Robinson Córdova",
        role: "Analista de Calidad",
        initials: "RC",
        avatarUrl: "https://placehold.co/40x40/70A1AF/313437?text=RC"
    },
    "bryan.vasquez": {
        username: "bryan.vasquez",
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
     "elias.ibanez": {
        username: "elias.ibanez",
        fullName: "Elias Ibañez",
        role: "Inspector de Calidad",
        initials: "EI",
        avatarUrl: "https://placehold.co/40x40/6BE69C/313437?text=EI"
    },
    "cristian.montellano": {
        username: "cristian.montellano",
        fullName: "Cristian Montellano",
        role: "Inspector de Calidad",
        initials: "CM",
        avatarUrl: "https://placehold.co/40x40/6BA7E6/313437?text=CM"
    },
    "daniel.palma": {
        username: "daniel.palma",
        fullName: "Daniel Palma",
        role: "Inspector de Calidad",
        initials: "DP",
        avatarUrl: "https://placehold.co/40x40/E66BA7/313437?text=DP"
    },
    "luis.parada": {
        username: "luis.parada",
        fullName: "Luis Parada",
        role: "Inspector de Calidad",
        initials: "LP",
        avatarUrl: "https://placehold.co/40x40/E6826B/313437?text=LP"
    },
};

export async function findUserByUsername(username: string): Promise<User | null> {
    return users[username] || users["jefe.calidad"];
}
