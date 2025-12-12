import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface MateriaType {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
}

interface MaestroMateria {
    id: number;
    cupo_maximo: number;
    materia: MateriaType;
}

export default function MaestroDashboard() {
    const [materias, setMaterias] = useState<MaestroMateria[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await api.get('/maestro/materias');
                setMaterias(response.data);
            } catch (error) {
                console.error('Error al cargar materias:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterias();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="mx-auto max-w-screen-xl">
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Panel del Maestro
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Bienvenido, {usuario ? usuario.nombre : 'Maestro'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </header>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Mis Materias Asignadas
                    </h2>

                    {(() => {
                        if (loading) {
                            return <p className="text-gray-500 dark:text-gray-400">Cargando materias...</p>;
                        }
                        if (materias.length === 0) {
                            return (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">No tienes materias asignadas actualmente.</p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 align-center md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {materias.map((m) => (
                                    <div
                                        key={m.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    {m.materia?.nombre || 'Nombre no disponible'}
                                                </h3>
                                                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 border border-primary-400">
                                                    {m.materia?.codigo}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                                Cupo Máximo: <span className="font-semibold text-gray-900 dark:text-white">{m.cupo_maximo}</span>
                                            </p>
                                            <button
                                                onClick={() => navigate(`/maestro/materia/${m.materia?.id}`)}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full justify-center"
                                            >
                                                Ver Alumnos &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
}
