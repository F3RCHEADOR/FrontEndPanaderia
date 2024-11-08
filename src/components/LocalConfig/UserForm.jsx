import React, { useState, useEffect } from 'react';

const localId2 = localStorage.getItem("localId");

const UserForm = ({ onSubmit, userToEdit, onClose }) => {
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cajero');
    const [localId, setLocalId] = useState('');

    useEffect(() => {
        if (userToEdit) {
            // Si estamos editando un usuario, pre-llenamos el formulario
            setUsername(userToEdit.username);
            setRole(userToEdit.role);
            setLocalId(userToEdit.localId || localId2); // Si el usuario es un Cajero o Mesero, asignamos el localId
            setId(userToEdit._id);
        } else {
            setLocalId(localId2);
        }
    }, [userToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { username, password, role, _id: id, localId };
        onSubmit(userData);
        onClose(); // Cierra el formulario al hacer submit
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-80">
                <h2 className="text-lg font-semibold text-center mb-4">
                    {userToEdit ? 'Editar Usuario' : 'Crear Usuario'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!userToEdit}
                        className="p-2 border rounded-md"
                    />
                    { userToEdit?.role !== 'admin' && (
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="cajero">Cajero</option>
                            <option value="mesero">Mesero</option>
                        </select>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 p-2 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                            {userToEdit ? 'Guardar Cambios' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
