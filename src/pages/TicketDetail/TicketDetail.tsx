import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { show as showTicket, update as updateTicket } from '../../api/tickets';
import { formatTimestamp } from "../../utils/dateFormatter.ts";
import { index as showComments, store as storeComments } from '../../api/tickets-comments';
import dayjs from 'dayjs';


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
    fecha_cierre: string | null;
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

type newTicketComment = {
    agente_id: number;
    comentario: string;
}

const TicketDetail = () => {
    const { id } = useParams();
    const [comentarios, setComentarios] = useState<comentario[]>([]);
    const [ticket, setTicket] = useState<ticket | null>(null);
    const [formComentario, setFormComentario] = useState<newTicketComment>({
        agente_id: 0,
        comentario: ''
    });
    const [estadoSelected, setEstadoSelected] = useState<string>('');

    useEffect(() => {
        if (!id) {
            return;
        }
        showTicket(Number(id)).then((data:ticket) => {
            if (data) {
                setTicket(data);
                setFormComentario((prev) => ({...prev, agente_id: data.agente.id}))
            }
        });

        showComments(Number(id)).then((data:comentario[]) => {
            if (data) {
                setComentarios(data);
            }
        });
    }, [id]);

    const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formComentario.comentario !== '') {
            storeComments(Number(id), formComentario).then((data) => {
                setComentarios((prev) => [...prev, data]);
            });
        }

        if(!ticket) {
            return
        }

        const formattedFechaCierre = estadoSelected === 'Finalizado'
        ? dayjs().format('YYYY-MM-DD HH:mm:ss')
        : (ticket.fecha_cierre || null);

        const updatedTicket: ticket = {
            ...ticket,
            estado: estadoSelected,
            fecha_cierre: formattedFechaCierre
        };
        updateTicket(Number(id), updatedTicket).then((data) => {
            setTicket(data);
        })

    }

    if (!ticket) return <div>Cargando...</div>;

    return (
        <div className='ticket-detail-content'>
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
                                    <td>{row.agente?.nombre || 'Sin agente'}</td>
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
            <form onSubmit={handleComment}>
                <fieldset className="form-comment">
                    <legend>Nuevo comentario</legend>
                    <div className='form-comment-fields'>
                        <label htmlFor="comentario">Comentario: </label>
                        <input
                            type="text"
                            id="comentario"
                            name="comentario"
                            placeholder="comentario"
                            value={formComentario.comentario}
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                setFormComentario((prev) => ({...prev, comentario: e.target.value}))
                            }}
                            disabled={ticket.estado === 'Finalizado'}
                        />
                        <label htmlFor="estado">Cambiar estado:</label>
                        <select
                            name="estado"
                            id="estado"
                            value={estadoSelected}
                            onChange={(e)=> setEstadoSelected(e.target.value)}
                            disabled={ticket.estado === 'Finalizado'}
                        >
                            <option value="">Seleccione un estado</option>
                            <option value="Creado">Creado</option>
                            <option value="Asignado">Asignado</option>
                            <option value="En progreso">En progreso</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>
                    <button type="submit">Comentar</button>
                </fieldset>
            </form>
            <Link to="/">Volver</Link>
        </div>
    );
}

export default TicketDetail;