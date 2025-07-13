import { NavLink } from 'react-router-dom';


const AdminSidebar = () => {

    const activeLink = 'bg-blue-600 text-white';
    const normalLink = 'text-gray-700 hover:bg-blue-100';


    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            </div>
            <nav className="mt-4">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2 px-4 transition duration-200`}>
                    Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2 px-4 transition duration-200`}>
                    Manage Products
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2 px-4 transition duration-200`}>
                    Manage Orders
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;