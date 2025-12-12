import { Link } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const firstImage = product.product_images?.[0];

  return (
    <Link to={`/producto/${product.id}`} className="group cursor-pointer block">
      <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm font-light">Sin imagen</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.title}
        </h3>

        <p className="text-sm font-light text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 text-xs font-light text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={12} />
            <span>{product.zone}</span>
          </div>

          {product.profiles && (
            <div className="flex items-center space-x-1">
              <User size={12} />
              <span>{product.profiles.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
