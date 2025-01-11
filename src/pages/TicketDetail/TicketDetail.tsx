import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { show as showTicket } from '../../api/tickets';

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

const TicketDetail = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [correo, setCorreo] = useState<string>('');
    const [estado, setEstado] = useState<string>('');
    const [fechaIngre, setFechaIngre] = useState<string>('');
    const [fechaCierre, setFechaCierre] = useState<string>('');

    useEffect(() => {
        if (!id) {
            return;
        }
        showTicket(Number(id)).then((data:ticket) => {
            if (data) {
                setNombre(data.solicitud.nombre);
                setApellido(data.solicitud.apellido);
                setCorreo(data.solicitud.correo);
                setEstado(data.estado);
                setFechaCierre(data.fecha_cierre);
                setFechaIngre(data.created_at);
            }
        });
    }, [id]);

    return (
        <div>
            <h1>Caso #{id}</h1>
            <div className="solicitud">
                <h2>Solicitante:</h2>
                <p>Nombre: {nombre}</p>
                <p>Apellido: {apellido}</p>
                <p>Correo: {correo}</p>
                <p>Estado actual: {estado}</p>
                <p>Fecha de ingreso: {fechaIngre}</p>
                <p>Fecha de cierre: {fechaCierre}</p>
            </div>
            <Link to="/">Volver</Link>
        </div>
    );
}

export default TicketDetail;