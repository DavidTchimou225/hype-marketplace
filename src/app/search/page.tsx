'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

interface SearchResult {
  id: string;
  type: 'product' | 'category' | 'store';
  name: string;
  description?: string;
  image?: string;
  category?: string;
  store?: string;
  price?: number;
  productCount?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');

  useEffect(() => {
    if (query) {
      performSearch(query, type);
    }
  }, [query, type]);

  const performSearch = async (searchQuery: string, searchType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&limit=20`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string, filters: any) => {
    setQuery(newQuery);
    setType(filters.type);
    performSearch(newQuery, filters.type);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100) + ' FCFA';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '📦';
      case 'category': return '📂';
      case 'store': return '🏪';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product': return 'Produit';
      case 'category': return 'Catégorie';
      case 'store': return 'Boutique';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium">9:41 AM</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </header>

      {/* Top Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Recherche</h1>
        <div className="w-10"></div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-4 border-b">
        <SearchBar 
          placeholder="Rechercher des produits, boutiques, catégories..."
          onSearch={handleSearch}
        />
      </div>

      {/* Results */}
      <div className="px-4 py-6">
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Résultats pour "{query}"
            </h2>
            <p className="text-sm text-gray-600">
              {loading ? 'Recherche en cours...' : `${results.length} résultat(s) trouvé(s)`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={
                  result.type === 'product' ? `/product/${result.id}` :
                  result.type === 'category' ? `/category/${result.id}` :
                  result.type === 'store' ? `/store/${result.id}` : '#'
                }
                className="block"
              >
                <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {result.image ? (
                        <img 
                          src={result.image} 
                          alt={result.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-xl">{getTypeIcon(result.type)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{result.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {result.type === 'product' && (
                            <>
                              {result.category && (
                                <span className="text-xs text-blue-600">📂 {result.category}</span>
                              )}
                              {result.store && (
                                <span className="text-xs text-green-600">🏪 {result.store}</span>
                              )}
                            </>
                          )}
                          {(result.type === 'category' || result.type === 'store') && result.productCount !== undefined && (
                            <span className="text-xs text-gray-500">
                              {result.productCount} produit{result.productCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        {result.type === 'product' && result.price && (
                          <span className="font-semibold text-gray-900">
                            {formatPrice(result.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-gray-400 flex-shrink-0">
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query && !loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun résultat pour "{query}". Essayez avec d'autres mots-clés.
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto mb-6">
              <p className="font-medium text-gray-900 mb-3">💡 Suggestions :</p>
              <ul className="space-y-2 text-sm text-gray-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Vérifiez l'orthographe des mots-clés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Utilisez des termes plus généraux (ex: "robe" au lieu de "robe ankara")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Essayez différentes catégories avec les filtres ci-dessus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Recherchez par marque ou nom de boutique</span>
                </li>
              </ul>
            </div>
            
            <div className="max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-3">🔥 Recherches populaires :</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Wax', 'Robe', 'Bijoux', 'Sac', 'Chaussures', 'Bogolan', 'Dashiki', 'Cosmétiques'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      performSearch(term, type);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Commencez votre recherche</h3>
            <p className="text-gray-600 mb-8">
              Recherchez des produits, boutiques ou catégories
            </p>
            
            <div className="max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-3">🔥 Recherches populaires :</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Wax', 'Robe', 'Bijoux', 'Sac', 'Chaussures', 'Bogolan', 'Dashiki', 'Cosmétiques'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      performSearch(term, type);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
