import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Star, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (profile) {
      setName(profile.name);
      setZone(profile.zone);
    }
  }, [user, profile, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(name, zone);
      setMessage('Perfil actualizado correctamente');
      setEditing(false);
    } catch (err) {
      setMessage('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-light text-gray-900">Mi perfil</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>

          {message && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="zone" className="block text-sm font-light text-gray-700 mb-2">
                  Zona / Ubicación
                </label>
                <input
                  id="zone"
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setName(profile.name);
                    setZone(profile.zone);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-light hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <User size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-light text-gray-600">Nombre</p>
                  <p className="text-lg font-light text-gray-900">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-light text-gray-600">Email</p>
                  <p className="text-lg font-light text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-light text-gray-600">Zona</p>
                  <p className="text-lg font-light text-gray-900">{profile.zone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-light text-gray-600">Rating</p>
                  <p className="text-lg font-light text-gray-900">{profile.rating} (próximamente)</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-6 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
              >
                Editar perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
