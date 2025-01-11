const API_URL = 'http://127.0.0.1:8000/api';


type agente = {
    id: number;
    nombre: string;
}

type newTicketComment = {
    agente_id: number;
    comentario: string;
}

type comentario = {
    id: number;
    ticket_id: number;
    agent_id: number;
    comentario: string;
    created_at: string;
    updated_at: string;
    agente: agente;
}

export const index = async (id: number) => {
    const response = await fetch(`${API_URL}/tickets/${id}/comments`);
    if (!response.ok) {
        throw new Error('Failed to fetch tickets-comments');
    }
    const data = await response.json();
    return data;
}

export const store = async (id:number, ticketComment: newTicketComment) => {
    const response = await fetch(`${API_URL}/tickets/${id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketComment),
    });
    if (!response.ok) {
        throw new Error('Failed to create ticket-comment');
    }
    const data = await response.json();
    return data;
}