import React, { useState, useEffect } from 'react';

const localId2 = localStorage.getItem("localId");

const UserForm = ({ onSubmit, userToEdit, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cajero');
    const [localId, setLocalId] = useState('');

    useEffect(() => {
        if (userToEdit) {
            // Si estamos editando un usuario, pre-llenamos el formulario
            setUsername(userToEdit.username);
            setRole(userToEdit.role);
            setLocalId(userToEdit.localId || localId2); // Si el usuario es un Cajero o Mesero, asignamos el localId
        }else{
          setLocalId(localId2);
        }
    }, [userToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { username, password, role, localId };
        onSubmit(userData);
        onClose(); // Cierra el formulario al hacer submit
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{userToEdit ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            value={role} // Asegúrate de que el valor se maneje a través del estado `role`
                            onChange={(e) => setRole(e.target.value)} // Actualiza el estado cuando cambia el select
                            className="w-full px-4 py-2 border rounded-md"
                        >
                            <option value="cajero">Cajero</option>
                            <option value="mesero">Mesero</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            {userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
