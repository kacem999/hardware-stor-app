import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Your existing public navbar

const PublicLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                {/* Public pages will be rendered here */}
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;