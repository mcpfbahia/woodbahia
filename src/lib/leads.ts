import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface LeadData {
    name: string;
    phone: string;
    email?: string;
    source: 'simulador' | 'contato' | 'simulador-parcelamento' | string;
    message?: string;
    status?: "Novo" | "Em Atendimento" | "Finalizado";
    detalhes?: any;
    createdAt?: any;
}

export const saveLead = async (data: LeadData) => {
    if (!db) {
        console.warn('Firebase DB não inicializado. Lead não será salvo no Firestore:', data);
        return 'offline-id';
    }

    try {
        const leadsRef = collection(db, 'leads');
        const docRef = await addDoc(leadsRef, {
            ...data,
            status: data.status || "Novo",
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error: any) {
        console.error('Erro ao salvar lead:', error);
        throw error;
    }
};
