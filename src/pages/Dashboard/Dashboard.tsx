import Navbar  from '../../Components/Navbar.tsx'
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return(
        <div className={styles['Dashboard-content']}>
            <Navbar />
            <h1>Dashboard</h1>
        </div>
    );
}

export default Dashboard;