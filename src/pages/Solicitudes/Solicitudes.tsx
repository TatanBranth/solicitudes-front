import { useEffect, useState } from "react";
import { store as storeSolicitud, index as indexSolicitud } from "../../api/solicitudes.ts";
import { formatTimestamp } from "../../utils/dateFormatter.ts";
import NavBar from "../../Components/Navbar.tsx";
import styles from './Solicitudes.module.css'

type solicitud = {
    id: number,
    nombre: string,
    apellido: string,
    correo: string,
    created_at: string,
    updated_at: string,
}

type newSolicitud = {
    nombre: string;
    apellido: string;
    correo: string;
}

const Solicitudes = () => {

    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [solicitudes, setSolicitudes] =useState<solicitud[]>([])

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

        indexSolicitud().then((data)=> {
            if(data.length > 0) {
                setSolicitudes(data);
            } else {
                setError('No hay solicitudes')
            }
        })

    }, [])

        const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const newSolicitud: newSolicitud = {
                nombre: nombre,
                apellido: apellido,
                correo: correo
            }
            storeSolicitud(newSolicitud).then((data) => {
                setSolicitudes(data);
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
        <div className={styles['solicitudes']}>
            <NavBar />
            <h2>Solicitudes</h2>
            {notification && <div className="notification info-message">{notification}</div>}
            {error && <div className="notification error-message">{error}</div>}
            <div className={styles['solicitudes-table']}>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nombre</th>
                            <th>apellido</th>
                            <th>correo</th>
                            <th>creada</th>
                            <th>actualizada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            solicitudes.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.nombre}</td>
                                    <td>{row.apellido}</td>
                                    <td>{row.correo}</td>
                                    <td>{row.created_at ? formatTimestamp(row.created_at) : ''}</td>
                                    <td>{row.updated_at ? formatTimestamp(row.updated_at) : ''}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className={styles['solicitudes-form']}>
                <form onSubmit={handleForm}>
                    <fieldset>
                        <legend>Nueva solicitud</legend>
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
                        <button type="submit" className="button button-green">Crear</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
};

export default Solicitudes;