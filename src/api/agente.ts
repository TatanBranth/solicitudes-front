
const API_URL = 'http://127.0.0.1:8000/api';

type newAgente = {
    nombre: string;
    apellido: string;
    correo: string;
}

export const index = async () => {
    const response = await fetch(`${API_URL}/agentes`);
    if (!response.ok) {
        throw new Error('Failed to fetch agentes');
    }
    const data = await response.json();
    return data;
}

export const store = async (agente: newAgente) => {
    const response = await fetch(`${API_URL}/agentes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agente),
    });
    if (!response.ok) {
        throw new Error('Failed to create agente');
    }
    const data = await response.json();
    return data;
}

export const show = async (id: number) => {
    const response = await fetch(`${API_URL}/agentes/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch agente');
    }
    const data = await response.json();
    return data;
}

export const update = async (id: number, agente: newAgente) => {
    const response = await fetch(`${API_URL}/agentes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agente),
    });
    if (!response.ok) {
        throw new Error('Failed to update agente');
    }
    const data = await response.json();
    return data;
}

export const destroy = async (id: number) => {
    const response = await fetch(`${API_URL}/agentes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete agente');
    }
}