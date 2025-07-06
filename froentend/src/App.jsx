import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';

function App() {
    const { user } = useAuth();

    return (
        <ToastProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        </ToastProvider>
    );
}

export default App;
