import { useEffect, useState } from "react";
import { index as indexTickets } from "../../api/tickets.ts";
import { index as indexAgentes } from "../../api/agente.ts";
import { store as storeSolicitud } from "../../api/solicitudes.ts";
import { Link } from 'react-router-dom';

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

type newSolicitud = {
    nombre: string;
    apellido: string;
    correo: string;
}

const Ticket = () => {

    const [tableData, setTableData] = useState<Ticket[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [agentes, setAgentes] = useState<Record<number, string>>({});

    /* datos solicitante */
    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [correo, setCorreo] = useState<string>('');


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

    function formatTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
    }

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSolicitud: newSolicitud = {
            nombre: nombre,
            apellido: apellido,
            correo: correo
        }
        storeSolicitud(newSolicitud).then((data: string) => {
            console.log(JSON.stringify(data));
            setNotification("Solicitud creada con exito");
            cleanForm();
        });

    }

    const cleanForm = () => {
        setNombre('');
        setApellido('');
        setCorreo('');
    }


    return (
        <div className="content">
            <h1>Tabla de Tickets</h1>
            <div className="table-content">
                {notification && <div className="notification info-message">{notification}</div>}
                {error && <div className="notification error-message">{error}</div>}
                <table className="table">
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
            <div className="form-ticket-content">
                <form onSubmit={handleForm}>
                    <fieldset>
                        <legend>Nuevo caso</legend>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="nombre"
                            value={nombre}
                            onChange={(e)=> setNombre(e.currentTarget.value)}
                        />

                        <label htmlFor="apellido">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            placeholder="apellido"
                            value={apellido}
                            onChange={(e)=> setApellido(e.currentTarget.value)}
                        />

                        <label htmlFor="correo">Correo</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            placeholder="correo"
                            value={correo}
                            onChange={(e)=> setCorreo(e.currentTarget.value)}
                        />
                        <button type="submit">Crear</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Ticket;