import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}!</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
        </div>
    );
}
