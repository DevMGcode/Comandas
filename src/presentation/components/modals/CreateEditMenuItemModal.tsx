import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@domain/entities/MenuItem';
import { MenuItemCategory } from '@domain/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CreateEditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    category: MenuItemCategory;
    imageUrl?: string;
    preparationTime?: number;
    ingredients?: string[];
  }) => Promise<void>;
  menuItem?: MenuItem | null;
}

const categories = [
  { value: MenuItemCategory.APPETIZER, label: '🥗 Entradas' },
  { value: MenuItemCategory.MAIN_COURSE, label: '🍽️ Plato Principal' },
  { value: MenuItemCategory.DESSERT, label: '🍰 Postres' },
  { value: MenuItemCategory.BEVERAGE, label: '🥤 Bebidas' },
  { value: MenuItemCategory.SPECIAL, label: '⭐ Especiales' },
];

export function CreateEditMenuItemModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  menuItem 
}: CreateEditMenuItemModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MenuItemCategory>(MenuItemCategory.MAIN_COURSE);
  const [imageUrl, setImageUrl] = useState('');
  const [preparationTime, setPreparationTime] = useState('15');
  const [ingredients, setIngredients] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name);
      setDescription(menuItem.description);
      setPrice(menuItem.price.toString());
      setCategory(menuItem.category);
      setImageUrl(menuItem.imageUrl || '');
      setPreparationTime(menuItem.preparationTime.toString());
      setIngredients(menuItem.ingredients.join(', '));
    } else {
      resetForm();
    }
  }, [menuItem, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory(MenuItemCategory.MAIN_COURSE);
    setImageUrl('');
    setPreparationTime('15');
    setIngredients('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!description.trim()) {
      alert('La descripción es requerida');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      alert('El precio debe ser un número válido');
      return;
    }

    const prepTime = parseInt(preparationTime);
    if (isNaN(prepTime) || prepTime < 0) {
      alert('El tiempo de preparación debe ser un número válido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: priceValue,
        category,
        imageUrl: imageUrl.trim() || undefined,
        preparationTime: prepTime,
        ingredients: ingredients
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0)
      });
      resetForm();
      onClose();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-2xl"
        >
          <Card className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {menuItem ? '✏️ Editar Plato' : '➕ Nuevo Plato del Menú'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Paella Valenciana"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe el plato..."
                  rows={3}
                  required
                />
              </div>

              {/* Precio y Tiempo de Preparación */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tiempo Prep. (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        category === cat.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL de Imagen */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Ingredientes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ingredientes (separados por comas)
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Arroz, Mariscos, Azafrán, Pimientos..."
                  rows={2}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Guardando...' : (menuItem ? 'Actualizar' : 'Crear Plato')}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
