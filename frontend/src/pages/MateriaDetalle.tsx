import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Alumno {
    id: number;
    nombre: string;
    matricula: string;
    calificaciones?: { nota: string }[];
}

export default function MateriaDetalle() {
    const { materiaId } = useParams();
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [materia, setMateria] = useState<{ nombre: string; codigo: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAlumnos = async () => {
        try {
            const response = await api.get(`/maestro/alumnos/${materiaId}`);
            // Backend now returns { materia: {...}, alumnos: [...] }
            setAlumnos(response.data.alumnos);
            setMateria(response.data.materia);
        } catch (error) {
            console.error('Error al cargar alumnos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (materiaId) {
            fetchAlumnos();
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'recargar_alumnos') {
                fetchAlumnos();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [materiaId]);

    const getNota = (alumno: Alumno) => {
        if (alumno.calificaciones && alumno.calificaciones.length > 0) {
            return alumno.calificaciones[0].nota;
        }
        return '-';
    };

    const getGradeColor = (nota: string) => {
        if (nota === '-') return 'text-gray-500 dark:text-gray-400';
        const n = parseFloat(nota);
        if (n >= 6) return 'text-green-600 dark:text-green-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="mx-auto max-w-screen-xl">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {materia ? `${materia.nombre} (${materia.codigo})` : 'Detalle de Materia'}
                        </h1>
                        <button
                            onClick={() => navigate('/maestro/dashboard')}
                            className="text-primary-600 dark:text-primary-500 hover:underline font-medium text-sm"
                        >
                            &larr; Volver al Panel
                        </button>
                    </div>
                </header>

                <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg border dark:border-gray-700">
                    <div className="p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Lista de Alumnos Inscritos
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Matrícula</th>
                                    <th scope="col" className="px-6 py-3">Nombre del Alumno</th>
                                    <th scope="col" className="px-6 py-3">Calificación</th>
                                    <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center">Cargando alumnos...</td>
                                    </tr>
                                )}
                                {!loading && alumnos.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center">No hay alumnos inscritos en esta materia.</td>
                                    </tr>
                                )}
                                {alumnos.map((alumno) => (
                                    <tr key={alumno.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {alumno.matricula}
                                        </td>
                                        <td className="px-6 py-4">
                                            {alumno.nombre}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${getGradeColor(getNota(alumno))}`}>
                                            {getNota(alumno)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => {
                                                    const width = 600;
                                                    const height = 650;
                                                    const left = (window.screen.width - width) / 2;
                                                    const top = (window.screen.height - height) / 2;
                                                    window.open(
                                                        `/maestro/calificar/${materiaId}/${alumno.id}`,
                                                        'CalificarAlumno',
                                                        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                                                    );
                                                }}
                                                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                            >
                                                Calificar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
