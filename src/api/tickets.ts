
const API_URL = 'http://127.0.0.1:8000/api';

type newTicket = {
    solicitud_id: number;
    agente_id: number;
    estado: string;
    fecha_cierre: string | null;
}

export const index = async () => {
    const response = await fetch(`${API_URL}/tickets`);
    if (!response.ok) {
        throw new Error('Failed to fetch tickets');
    }
    const data = await response.json();
    return data;
}

export const store = async (ticket: newTicket) => {
    const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    });
    if (!response.ok) {
        throw new Error('Failed to create ticket');
    }
    const data = await response.json();
    return data;
}

export const show = async (id: number) => {
    const response = await fetch(`${API_URL}/tickets/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch ticket');
    }
    const data = await response.json();
    return data;
}

export const update = async (id: number, ticket: newTicket) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    });
    if (!response.ok) {
        throw new Error('Failed to update ticket');
    }
    const data = await response.json();
    return data;
}

export const destroy = async (id: number) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete ticket');
    }
}