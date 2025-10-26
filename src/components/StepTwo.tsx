interface StepTwoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function StepTwo({ formData, updateFormData, errors }: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Informations de la Boutique</h2>
        <p className="text-gray-600 mt-2">Décrivez votre boutique et ses coordonnées</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la boutique *
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => updateFormData('storeName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storeName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Le nom de votre boutique"
          />
          {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description de la boutique *
          </label>
          <textarea
            value={formData.storeDescription}
            onChange={(e) => updateFormData('storeDescription', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storeDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Décrivez votre boutique, vos produits et services..."
          />
          {errors.storeDescription && <p className="text-red-500 text-sm mt-1">{errors.storeDescription}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de la boutique *
          </label>
          <input
            type="text"
            value={formData.storeAddress}
            onChange={(e) => updateFormData('storeAddress', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storeAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Adresse physique de votre boutique"
          />
          {errors.storeAddress && <p className="text-red-500 text-sm mt-1">{errors.storeAddress}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville de la boutique *
          </label>
          <input
            type="text"
            value={formData.storeCity}
            onChange={(e) => updateFormData('storeCity', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storeCity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ville de votre boutique"
          />
          {errors.storeCity && <p className="text-red-500 text-sm mt-1">{errors.storeCity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de commerce
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => updateFormData('businessType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="physique">Boutique physique uniquement</option>
            <option value="en_ligne">Vente en ligne uniquement</option>
            <option value="mixte">Boutique physique + en ligne</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone de la boutique *
          </label>
          <input
            type="tel"
            value={formData.storePhone}
            onChange={(e) => updateFormData('storePhone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storePhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+225 XX XX XX XX XX"
          />
          {errors.storePhone && <p className="text-red-500 text-sm mt-1">{errors.storePhone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de la boutique *
          </label>
          <input
            type="email"
            value={formData.storeEmail}
            onChange={(e) => updateFormData('storeEmail', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.storeEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@maboutique.com"
          />
          {errors.storeEmail && <p className="text-red-500 text-sm mt-1">{errors.storeEmail}</p>}
        </div>
      </div>
    </div>
  );
}
