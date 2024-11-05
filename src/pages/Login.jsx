import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const backend = import.meta.env.VITE_BUSINESS_BACKEND;

const Login = () => {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(backend + 'api/usuarios/login', {
                username,
                password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('localId', response.data.localId);
    
            toast.current.show({ severity: "success", summary: 'Sesión Iniciada Con Éxito', life: 3000 });
    
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
                toast.current.show({ severity: "error", summary: err.response.data.error, life: 3000 });
            } else {
                setError('Error en la conexión al servidor');
            }
        }
    };
    
    return (
        <>
            <Toast ref={toast} />
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <div className="bg-white shadow-lg rounded-lg w-96 p-6 transition transform hover:scale-105 duration-300">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-2xl font-bold text-blue-600">DineDash</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-center mb-6">Iniciar Sesión</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <Button
                            type="submit"
                            label='Iniciar Sesión'
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
