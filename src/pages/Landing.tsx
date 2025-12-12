import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900 mb-8">
          Lixodeluxo
        </h1>

        <div className="space-y-6 mb-12">
          <p className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed">
            Un espacio para dar nueva vida a objetos que ya no necesitas.
          </p>

          <p className="text-lg font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Lixodeluxo es un proyecto de donación y reutilización donde puedes compartir
            productos que otros puedan aprovechar. Sin compras, sin transacciones,
            solo generosidad y sostenibilidad.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/productos"
            className="inline-flex items-center space-x-2 px-8 py-3 border border-gray-900 text-gray-900 font-light hover:bg-gray-900 hover:text-white transition-colors"
          >
            <span>Explorar productos</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/donar"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
          >
            <span>Donar un producto</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
