import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface LeadData {
    nome: string;
    whatsapp: string;
    origem: 'simulador' | 'contato' | 'simulador-parcelamento';
    detalhes: any;
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
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error: any) {
        console.error('Erro ao salvar lead:', error);
        throw error;
    }
};
