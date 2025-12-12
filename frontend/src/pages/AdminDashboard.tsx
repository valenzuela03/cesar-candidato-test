import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Materia {
    id: number;
    nombre: string;
    codigo: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedMateria, setSelectedMateria] = useState<string>('');
    const [reporte, setReporte] = useState<any[]>([]);

    const fetchReporte = async () => {
        try {
            let url = '/controlescolar/reporte';
            if (selectedMateria) {
                url = `/controlescolar/reporte/${selectedMateria}`;
            }
            const res = await api.get(url);
            setReporte(res.data);
        } catch (error) {
            console.error('Error al cargar reporte', error);
        }
    };

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const res = await api.get('/controlescolar/materias');
                setMaterias(res.data);
            } catch (error) {
                console.error('Error al cargar materias', error);
            }
        };
        fetchMaterias();
    }, []);
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'recargar_reporte_admin') {
                fetchReporte();
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [selectedMateria]);

    useEffect(() => {
        fetchReporte();
    }, [selectedMateria]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="mx-auto max-w-screen-xl">
                <header className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Control Escolar
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </header>

                <div className="mb-6 flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
                    <label className="font-medium text-gray-900 dark:text-white">Filtrar por Materia:</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedMateria}
                        onChange={(e) => setSelectedMateria(e.target.value)}
                    >
                        <option value="">Reporte Global (Promedios)</option>
                        {materias.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg border dark:border-gray-700">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Matrícula</th>
                                <th className="px-6 py-3">Alumno</th>
                                {selectedMateria ? (
                                    <>
                                        <th className="px-6 py-3">Materia</th>
                                        <th className="px-6 py-3">Nota</th>
                                        <th className="px-6 py-3 text-center">Acciones</th>
                                    </>
                                ) : (
                                    <th className="px-6 py-3">Promedio General</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {reporte.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">No hay datos para mostrar</td></tr>
                            ) : (
                                reporte.map((item, idx) => (
                                    <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.Alumno?.matricula || item.matricula}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.Alumno?.nombre || item.nombre}
                                        </td>

                                        {selectedMateria ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    {item.Materia?.nombre || 'Desconocida'}
                                                </td>
                                                <td className={`px-6 py-4 font-bold ${Number(item.nota) >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {item.nota}
                                                </td>
                                                <td className="px-6 py-4 flex justify-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            const width = 600;
                                                            const height = 650;
                                                            const left = (window.screen.width - width) / 2;
                                                            const top = (window.screen.height - height) / 2;
                                                            const matId = item.Materia?.id || item.materia_id || selectedMateria;
                                                            const aluId = item.Alumno?.id || item.alumno_id;

                                                            window.open(
                                                                `/admin/editar/${matId}/${aluId}`,
                                                                'AdminEditar',
                                                                `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                                                            );
                                                        }}
                                                        className="text-primary-600 hover:text-white border border-primary-600 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600 dark:focus:ring-primary-800 transition-all ml-2"
                                                        title="Editar o Eliminar"
                                                    >
                                                        Gestionar
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                                                {item.nota}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </section >
    );
}

