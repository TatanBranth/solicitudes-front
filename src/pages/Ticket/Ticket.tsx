import { useEffect, useState } from "react";
import { index as indexTickets, store as storeTickets } from "../../api/tickets.ts";
import { index as indexAgentes } from "../../api/agente.ts";
import { Link } from 'react-router-dom';
import { formatTimestamp } from "../../utils/dateFormatter.ts";
import Navbar from '../../Components/Navbar.tsx';
import styles from './Ticket.module.css'

type Ticket = {
    id: number;
    solicitud_id: number;
    agente_id: number;
    estado: string;
    fecha_cierre: string;
    created_at: string;
    updated_at: string;
}

type Agente = {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
}

const Ticket = () => {

    const [tableData, setTableData] = useState<Ticket[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [agentes, setAgentes] = useState<Record<number, string>>({});
    const [solicitudId, setSolicitudId] = useState<number>(0);
    const [agenteId, setAgenteId] = useState<number>(0);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        indexTickets().then((data) => {
            if(data.length > 0){
                setTableData(data)
            }else {
                setError('No hay datos')
            }
        }
        );

        indexAgentes().then((agentes: Agente[]) => {
            const map: Record<number, string> = {};
            if(agentes.length === 0){
                setError('No hay agentes')
                return;
            }
            agentes.forEach((agente) => {
              map[agente.id] = agente.nombre + " " + agente.apellido;
            });
            setAgentes(map);
        });

    }, []);

    const getAgenteName = (id: number) => {
        return agentes[id] || 'Desconocido';
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (agenteId === 0 || solicitudId === 0) {
            return;
        }

        const newTicket = {
            solicitud_id: solicitudId,
            agente_id: agenteId,
            estado: "Creado",
            fecha_cierre: null,
        }

        storeTickets(newTicket).then((data)=> {
            if(data){
                const map: Record<number, string> = {};
                data.forEach((ticket) => {
                    if (ticket.agente) {
                        map[ticket.agente.id] = `${ticket.agente.nombre} ${ticket.agente.apellido}`;
                    }
                });
                setAgentes(map);
                setTableData(data);
            }
        })
    }

    return (
        <div className={styles['ticket']}>
            <Navbar />
            <div className="agentes">
                <h2>Tabla de agentes</h2>
                <div className="tabla-agentes-content">
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Agente</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            Object.entries(agentes).map(([id, nombre]) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{nombre}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <h2>Tabla de Tickets</h2>
            {notification && <div className="notification info-message">{notification}</div>}
            {error && <div className="notification error-message">{error}</div>}
            <div className={styles['ticket-table']}>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th># Solicitud</th>
                            <th>Agente</th>
                            <th>Estado</th>
                            <th>Fecha cierre</th>
                            <th>Fecha creacion</th>
                            <th>Fecha actualizacion</th>
                            <th>Ver detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.solicitud_id}</td>
                                    <td>{getAgenteName(row.agente_id)}</td>
                                    <td>{row.estado}</td>
                                    <td>{row.fecha_cierre}</td>
                                    <td>{row.created_at ? formatTimestamp(row.created_at) : ''}</td>
                                    <td>{row.updated_at ? formatTimestamp(row.updated_at) : ''}</td>
                                    <td>
                                        <Link to={`/detail/${row.id}`}>
                                            Detalle
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
            </div>
            <div className={styles['ticket-form']}>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Crear nuevo ticket</legend>
                        <label htmlFor="solicitud">Solicitud id</label>
                        <input
                            type="number"
                            id="solicitud"
                            name="solicitud"
                            placeholder="id de la solicitud"
                            value={solicitudId}
                            onChange={(e)=> setSolicitudId(Number(e.target.value))}
                        />

                        <label htmlFor="agente">Agente id</label>
                        <input
                            type="number"
                            id="agente"
                            name="agente"
                            placeholder="id de el agente"
                            value={agenteId}
                            onChange={(e)=> setAgenteId(Number(e.target.value))}
                        />
                        <button type="submit" className="button button-green">Crear</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Ticket;