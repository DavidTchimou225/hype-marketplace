const PRODUCT_CATEGORIES = [
  { id: 'mode', label: 'Mode & Vêtements', icon: '👗' },
  { id: 'electronique', label: 'Électronique & High-Tech', icon: '📱' },
  { id: 'maison', label: 'Maison & Décoration', icon: '🏠' },
  { id: 'beaute', label: 'Beauté & Cosmétiques', icon: '💄' },
  { id: 'sport', label: 'Sport & Loisirs', icon: '⚽' },
  { id: 'alimentation', label: 'Alimentation & Boissons', icon: '🍕' },
  { id: 'automobile', label: 'Automobile & Moto', icon: '🚗' },
  { id: 'livre', label: 'Livres & Médias', icon: '📚' },
  { id: 'enfant', label: 'Enfants & Bébés', icon: '🧸' },
  { id: 'sante', label: 'Santé & Bien-être', icon: '💊' },
  { id: 'bijoux', label: 'Bijoux & Accessoires', icon: '💍' },
  { id: 'artisanat', label: 'Artisanat Local', icon: '🎨' },
  { id: 'autre', label: 'Autre', icon: '📦' }
];

interface StepThreeProps {
  formData: any;
  toggleCategory: (categoryId: string) => void;
  errors: Record<string, string>;
}

export default function StepThree({ formData, toggleCategory, errors }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Types d'Articles Vendus</h2>
        <p className="text-gray-600 mt-2">Sélectionnez les catégories de produits que vous vendez</p>
      </div>

      {errors.productCategories && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{errors.productCategories}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCT_CATEGORIES.map((category) => (
          <div
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              formData.productCategories.includes(category.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{category.label}</h3>
              </div>
              {formData.productCategories.includes(category.id) && (
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-blue-900 mb-2">Catégories sélectionnées:</h4>
        {formData.productCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.productCategories.map((categoryId: string) => {
              const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
              return (
                <span key={categoryId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {category?.icon} {category?.label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-blue-600 text-sm">Aucune catégorie sélectionnée</p>
        )}
      </div>
    </div>
  );
}
