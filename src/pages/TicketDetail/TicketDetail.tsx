import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { show as showTicket } from '../../api/tickets';
import { formatTimestamp } from "../../utils/dateFormatter.ts";
import { index as showComments } from '../../api/tickets-comments';


type solicitud = {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    created_at: string;
    updated_at: string;
}

type agente = {
    id: number;
    nombre: string;
}

type ticket = {
    id: number;
    solicitud_id: number;
    agente_id: number;
    estado: string;
    fecha_cierre: string;
    created_at: string;
    updated_at: string;
    solicitud: solicitud;
    agente: agente;
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

const TicketDetail = () => {
    const { id } = useParams();
    const [comentarios, setComentarios] = useState<comentario[]>([]);
    const [ticket, setTicket] = useState<ticket | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        showTicket(Number(id)).then((data:ticket) => {
            if (data) {
                setTicket(data);
            }
        });

        showComments(Number(id)).then((data:comentario[]) => {
            if (data) {
                setComentarios(data);
            }
        });
    }, [id]);

    if (!ticket) return <div>Cargando...</div>;

    return (
        <div>
            <h1>Caso #{id}</h1>
            <div className="solicitud">
                <h2>Solicitante:</h2>
                <p>Nombre: {ticket.solicitud.nombre}</p>
                <p>Apellido: {ticket.solicitud.apellido}</p>
                <p>Correo: {ticket.solicitud.correo}</p>
                <p>Estado actual: {ticket.estado}</p>
                <p>Fecha de ingreso: {ticket.created_at ? formatTimestamp(ticket.created_at): ''}</p>
                <p>Fecha de cierre: {ticket.fecha_cierre ? formatTimestamp(ticket.fecha_cierre): ''}</p>
            </div>
            <div className="table-content">
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Comentarios</th>
                            <th>Agente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comentarios.length > 0 ?
                            comentarios.map((row: comentario) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.comentario}</td>
                                    <td>{row.agente.nombre}</td>
                                </tr>
                            )):
                            <tr key='no comentarios'>
                                <td colSpan={3}>No hay comentarios</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
            </div>
            <Link to="/">Volver</Link>
        </div>
    );
}

export default TicketDetail;