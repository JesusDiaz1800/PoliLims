
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import type { Ensayo, Registro, RecentActivity } from "@/context/data-context";

// --- Ensayos ---

export async function getEnsayos(): Promise<Ensayo[]> {
  const q = query(collection(db, "ensayos"), orderBy("fecha", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ensayo));
}

export async function addEnsayo(ensayo: Omit<Ensayo, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, "ensayos"), ensayo);
  return docRef.id;
}

export async function updateEnsayo(id: string, ensayo: Partial<Ensayo>): Promise<void> {
  const docRef = doc(db, "ensayos", id);
  await updateDoc(docRef, ensayo);
}


// --- Registros ---

export async function getRegistros(): Promise<Registro[]> {
    const q = query(collection(db, "registros"), orderBy("fecha", "desc"), orderBy("hora", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registro));
}

export async function addRegistro(registro: Omit<Registro, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, "registros"), registro);
    return docRef.id;
}


// --- Recent Activity ---

export async function getRecentActivity(): Promise<RecentActivity[]> {
    const q = query(collection(db, "recentActivity"), orderBy("timestamp", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecentActivity));
}

export async function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>): Promise<void> {
    await addDoc(collection(db, "recentActivity"), {
        ...activity,
        timestamp: new Date().toISOString()
    });
}


// --- Analyst Options (derived from existing data for filters) ---

export async function getAnalystOptions() {
  const ensayos = await getEnsayos();
  const analystSet = new Set(ensayos.map(e => e.analista));
  return [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
}
