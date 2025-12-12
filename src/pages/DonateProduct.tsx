import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const DonateProduct = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (profile) {
      setZone(profile.zone);
    }
  }, [user, profile, navigate]);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const webpFile = new File([compressedFile], `${file.name.split('.')[0]}.webp`, {
        type: 'image/webp',
      });
      return webpFile;
    } catch (err) {
      console.error('Error compressing image:', err);
      throw err;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    setLoading(true);

    try {
      const compressedFiles: File[] = [];
      const newPreviews: string[] = [];

      for (const file of files) {
        const compressed = await compressImage(file);
        compressedFiles.push(compressed);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      setImages((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (err) {
      setError('Error al comprimir las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title,
          description,
          zone,
        })
        .select()
        .single();

      if (productError) throw productError;

      const imageUrls: { product_id: string; image_url: string; display_order: number }[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileName = `${productData.id}/${Date.now()}-${i}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrls.push({
          product_id: productData.id,
          image_url: publicUrl,
          display_order: i,
        });
      }

      if (imageUrls.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageUrls);

        if (imagesError) throw imagesError;
      }

      navigate('/productos');
    } catch (err) {
      setError('Error al crear el producto. Intenta de nuevo.');
      console.error(err);
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
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Donar un producto</h1>
          <p className="text-sm font-light text-gray-600">
            Comparte objetos que ya no necesitas con la comunidad
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-light text-gray-700 mb-2">
                Título del producto
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-light text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors resize-none"
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

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Imágenes del producto
              </label>

              <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload size={32} className="text-gray-400" />
                  <span className="text-sm font-light text-gray-600">
                    Haz clic para subir imágenes
                  </span>
                  <span className="text-xs font-light text-gray-500">
                    Se comprimirán automáticamente a WebP
                  </span>
                </label>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-light hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Creando producto...' : 'Publicar donación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
