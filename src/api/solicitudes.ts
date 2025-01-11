
const API_URL = 'http://127.0.0.1:8000/api';

type newSolicitud = {
    nombre: string;
    apellido: string;
    correo: string;
}

export const index = async () => {
    const response = await fetch(`${API_URL}/solicituds`);
    if (!response.ok) {
        throw new Error('Failed to fetch solicitudes');
    }
    const data = await response.json();
    return data;
}

export const store = async (solicitud: newSolicitud) => {
    const response = await fetch(`${API_URL}/solicituds`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(solicitud),
    });
    if (!response.ok) {
        throw new Error('Failed to create solicitud');
    }
    const data = await response.json();
    return data;
}

export const destroy = async (id: number) => {
    const response = await fetch(`${API_URL}/solicituds/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete solicitud');
    }
}

export const show = async (id: number) => {
    const response = await fetch(`${API_URL}/solicituds/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch solicitud');
    }
    const data = await response.json();
    return data;
}

export const update = async (id: number, solicitud: newSolicitud) => {
    const response = await fetch(`${API_URL}/solicituds/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitud),
    });
    if (!response.ok) {
        throw new Error('Failed to update solicitud');
    }
    const data = await response.json();
    return data;
}