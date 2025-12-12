import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function AdminEditarCalificacion() {
    const { materiaId, alumnoId } = useParams();
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');

    const [alumnoNombre, setAlumnoNombre] = useState('');
    const [materiaNombre, setMateriaNombre] = useState('');
    const [nota, setNota] = useState('');
    const [observaciones, setObservaciones] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/controlescolar/reporte/${materiaId}`);

                const item = res.data.find((c: any) => c.alumno_id === Number(alumnoId));

                if (item) {
                    console.log(item);
                    setAlumnoNombre(item.Alumno?.nombre || 'Desconocido');
                    setMateriaNombre(item.Materia?.nombre || '');
                    setNota(item.nota);
                    setObservaciones(item.observaciones || '');
                } else {
                    setMensaje('No se encontró la calificación.');
                }
            } catch (error) {
                console.error(error);
                setMensaje('Error al cargar datos.');
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
            await api.patch(`/controlescolar/calificaciones/${materiaId}/${alumnoId}`, {
                nota,
                observaciones
            });
            setMensaje('Actualizado correctamente.');
            refreshParent();
        } catch (error) {
            console.error(error);
            setMensaje('Error al guardar.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar esta calificación permanentemente?')) return;
        setMensaje('');
        try {
            await api.delete(`/controlescolar/calificaciones/${materiaId}/${alumnoId}`);
            setMensaje('Calificación eliminada.');
            setNota('-');
            refreshParent();
            setTimeout(() => window.close(), 1500);
        } catch (error) {
            console.error(error);
            setMensaje('Error al eliminar.');
        }
    };

    const refreshParent = () => {
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage('recargar_reporte_admin', '*');
            } catch (e) {
                console.log('No se pudo comunicar con ventana padre');
            }
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">Cargando...</div>;

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Editar Calificación
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Materia: <span className="font-semibold text-gray-900 dark:text-white">{materiaNombre}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Alumno: <span className="font-semibold text-gray-900 dark:text-white">{alumnoNombre}</span>
                    </p>

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSave}>
                        <div>
                            <label htmlFor="nota" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nota (0 - 10)</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={nota}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setNota('');
                                        return;
                                    }
                                    // Validar que sea numero (acepta decimales)
                                    if (!/^\d*\.?\d*$/.test(val)) return;

                                    const num = parseFloat(val);
                                    if (!isNaN(num) && num >= 0 && num <= 10) {
                                        setNota(val);
                                    }
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="obs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observaciones</label>
                            <textarea
                                rows={4}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={observaciones}
                                onChange={e => setObservaciones(e.target.value)}
                            ></textarea>
                        </div>

                        {mensaje && (
                            <div className={`p-4 mb-4 text-sm rounded-lg ${mensaje.includes('Error') || mensaje.includes('No') ? 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400' : 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400'}`} role="alert">
                                {mensaje}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                                Eliminar Calificación
                            </button>
                            <button
                                type="button"
                                onClick={() => window.close()}
                                className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            >
                                Cerrar Ventana
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
