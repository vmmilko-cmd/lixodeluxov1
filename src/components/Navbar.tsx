import { Link } from 'react-router-dom';
import { Package, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-light tracking-wide text-gray-900">
            Lixodeluxo
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/productos"
              className="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
            >
              Ver productos
            </Link>

            {user ? (
              <>
                <Link
                  to="/donar"
                  className="flex items-center space-x-1 text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Package size={16} />
                  <span>Donar producto</span>
                </Link>
                <Link
                  to="/perfil"
                  className="flex items-center space-x-1 text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={16} />
                  <span>Perfil</span>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
