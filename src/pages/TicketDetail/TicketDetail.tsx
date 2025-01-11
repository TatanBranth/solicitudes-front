import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { show as showTicket, update as updateTicket } from '../../api/tickets';
import { formatTimestamp } from "../../utils/dateFormatter.ts";
import { index as showComments, store as storeComments } from '../../api/tickets-comments';
import dayjs from 'dayjs';
import styles from './TicketDetail.module.css';


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
        <div className={styles['ticket-detail']}>
            <h1 className={styles['ticket-detail-title']}>Caso #{id}</h1>
            <div className={styles['ticket-detail-info']}>
                <div className={styles['ticket-detail-solicitud']}>
                    <h2>Solicitante:</h2>
                    <div className={styles['row']}>
                        <h3>Nombre:</h3>
                        <p>{ticket.solicitud.nombre}</p>
                    </div>
                    <div className={styles['row']}>
                        <h3>Apellido:</h3>
                        <p>{ticket.solicitud.apellido}</p>
                    </div>
                    <div className={styles['row']}>
                        <h3>Correo: </h3>
                        <p>{ticket.solicitud.correo}</p>
                    </div>
                    <div className={styles['row']}>
                        <h3>Estado actual:</h3>
                        <p>{ticket.estado}</p>
                    </div>
                    <div className={styles['row']}>
                        <h3>Fecha de ingreso: </h3>
                        <p> {ticket.created_at ? formatTimestamp(ticket.created_at): ''}</p>
                    </div>
                    <div className={styles['row']}>
                        <h3>Fecha de cierre: </h3>
                        <p>{ticket.fecha_cierre ? formatTimestamp(ticket.fecha_cierre): ''}</p>
                    </div>
                </div>
                <div className={styles['ticket-detail-comments']}>
                    <div className={styles['ticket-detail-comments-content']}>
                        <div className={styles['ticket-detail-table']}>
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
                    </div>
                    <form onSubmit={handleComment} className={styles['ticket-detail-form']}>
                        <fieldset className={styles['ticket-detail-form-fieldset']}>
                            <legend>Nuevo comentario</legend>
                            <div className={styles['ticket-detail-form-fieldset-fields']}>
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
                            <button type="submit" className='button button-blue'>Comentar</button>
                        </fieldset>
                    </form>
                </div>
            </div>
            <Link to="/ticket" className='button button-red'>Volver</Link>
        </div>
    );
}

export default TicketDetail;