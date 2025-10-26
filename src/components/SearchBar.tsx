'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: 'product' | 'category' | 'store';
  name: string;
  description?: string;
  image?: string;
  category?: string;
  store?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  type: 'all' | 'product' | 'category' | 'store';
  category?: string;
  store?: string;
}

export default function SearchBar({ placeholder = "Rechercher des produits, boutiques, catégories...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true);
      
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${filters.type}&limit=8`);
          const data = await response.json();
          setSuggestions(data.results || []);
          setIsOpen(true);
        } catch (error) {
          console.error('Erreur lors de la recherche de suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, filters.type]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery, filters);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.name);
    setIsOpen(false);
    onSearch?.(suggestion.name, { ...filters, type: suggestion.type });
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
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-lg">🔍</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-gray-900"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-black"></div>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tout', icon: '🔍' },
          { key: 'product', label: 'Produits', icon: '📦' },
          { key: 'category', label: 'Catégories', icon: '📂' },
          { key: 'store', label: 'Boutiques', icon: '🏪' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilters({ ...filters, type: filter.key as any })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.type === filter.key
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 truncate">{suggestion.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getTypeLabel(suggestion.type)}
                    </span>
                  </div>
                  {suggestion.description && (
                    <p className="text-sm text-gray-500 truncate">{suggestion.description}</p>
                  )}
                  {suggestion.type === 'product' && (
                    <div className="flex items-center gap-2 mt-1">
                      {suggestion.category && (
                        <span className="text-xs text-blue-600">📂 {suggestion.category}</span>
                      )}
                      {suggestion.store && (
                        <span className="text-xs text-green-600">🏪 {suggestion.store}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-gray-400">
                  <span className="text-sm">→</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Voir tous les résultats */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => handleSearch()}
              className="w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Voir tous les résultats pour "{query}"
            </button>
          </div>
        </div>
      )}

      {/* Aucun résultat */}
      {isOpen && query && suggestions.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-medium text-gray-900 mb-1">Aucun résultat trouvé</h3>
            <p className="text-sm text-gray-500">
              Essayez avec d'autres mots-clés ou vérifiez l'orthographe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
