import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

interface Alumno {
    id: number;
    nombre: string;
    matricula: string;
}

export default function CalificarAlumno() {
    const { materiaId, alumnoId } = useParams();
    const [alumno, setAlumno] = useState<Alumno | null>(null);
    const [nota, setNota] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/maestro/alumnos/${materiaId}/${alumnoId}`);
                // Endpoint returns { alumno: {...}, calificacion: {...} | null }
                setAlumno(response.data.alumno);
                if (response.data.calificacion) {
                    setNota(response.data.calificacion.nota);
                    setObservaciones(response.data.calificacion.observaciones || '');
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setMensaje('Error al cargar datos del alumno.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [materiaId, alumnoId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje('');
        try {
            await api.post(`/maestro/calificaciones/${materiaId}/${alumnoId}`, {
                nota,
                observaciones
            });
            setMensaje('Calificación guardada correctamente.');
            if (window.opener && !window.opener.closed) {
                try {
                    window.opener.postMessage('recargar_alumnos', '*');
                } catch (e) {
                    console.log('No se pudo comunicar con ventana padre');
                }
            }
        } catch (error) {
            console.error(error);
            setMensaje('Error al guardar.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">Cargando...</div>;
    if (!alumno) return <div className="p-8 text-white bg-gray-900 min-h-screen">Alumno no encontrado</div>;

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-2">
                        Calificar Alumno
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Estás calificando a <span className="font-semibold text-gray-900 dark:text-white">{alumno.nombre}</span>
                    </p>

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSave}>
                        <div>
                            <label htmlFor="nota" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nota (0 - 10)</label>
                            <input
                                type="number"
                                name="nota"
                                id="nota"
                                step="0.1"
                                min="0"
                                max="10"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                                value={nota}
                                onChange={e => setNota(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="obs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observaciones</label>
                            <textarea
                                name="obs"
                                id="obs"
                                rows={4}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={observaciones}
                                onChange={e => setObservaciones(e.target.value)}
                            ></textarea>
                        </div>

                        {mensaje && (
                            <div className={`p-4 mb-4 text-sm rounded-lg ${mensaje.includes('Error') ? 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400' : 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400'}`} role="alert">
                                {mensaje}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => window.close()}
                                className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            >
                                Cerrar
                            </button>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
