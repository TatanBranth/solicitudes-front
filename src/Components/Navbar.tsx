import { Link } from "react-router-dom";


const NavBar = () => {

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Solicitudes">Solicitudes</Link></li>
                <li><Link to="/Ticket">Ticket</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;