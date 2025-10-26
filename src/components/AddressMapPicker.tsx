'use client';

import { useEffect, useState, useRef } from 'react';

interface AddressMapPickerProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
}

export default function AddressMapPicker({ onAddressSelect, initialAddress = '' }: AddressMapPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Charger dynamiquement Leaflet uniquement côté client
  useEffect(() => {
    if (typeof window !== 'undefined' && showMap) {
      loadLeaflet();
    }
  }, [showMap]);

  const loadLeaflet = async () => {
    // Charger les styles Leaflet
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Charger Leaflet
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }
  };

  const initMap = () => {
    if (mapRef.current || !showMap) return;

    const L = (window as any).L;
    const defaultLat = coordinates?.lat || 5.3599517; // Abidjan par défaut
    const defaultLng = coordinates?.lng || -4.0082563;

    // Créer la carte
    mapRef.current = L.map('map').setView([defaultLat, defaultLng], 13);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Ajouter un marqueur draggable
    markerRef.current = L.marker([defaultLat, defaultLng], {
      draggable: true
    }).addTo(mapRef.current);

    // Mettre à jour l'adresse quand on déplace le marqueur
    markerRef.current.on('dragend', function(e: any) {
      const position = e.target.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    // Géocoder l'adresse initiale si présente
    if (coordinates) {
      reverseGeocode(coordinates.lat, coordinates.lng);
    }
  };

  // Obtenir la position GPS de l'utilisateur
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        await reverseGeocode(latitude, longitude);
        setLoading(false);
        setShowMap(true);

        // Mettre à jour la carte si elle existe
        if (mapRef.current && markerRef.current) {
          const L = (window as any).L;
          mapRef.current.setView([latitude, longitude], 15);
          markerRef.current.setLatLng([latitude, longitude]);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Vous devez autoriser l\'accès à votre position');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Position indisponible');
            break;
          case err.TIMEOUT:
            setError('La demande a expiré');
            break;
          default:
            setError('Erreur lors de la récupération de la position');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Convertir coordonnées → adresse (géocodage inversé)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setError(''); // Effacer les erreurs précédentes
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'HypeMarketplace/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Adresse non trouvée');
      }
      
      // Construire une adresse lisible avec plusieurs niveaux de fallback
      let formattedAddress = '';
      const addr = data.address || {};
      
      // Essayer de construire une adresse structurée
      const addressParts = [];
      
      // Niveau 1: Rue/route
      if (addr.road || addr.street || addr.pedestrian) {
        addressParts.push(addr.road || addr.street || addr.pedestrian);
      } else if (addr.residential || addr.neighbourhood) {
        addressParts.push(addr.residential || addr.neighbourhood);
      }
      
      // Niveau 2: Quartier/zone
      if (addr.suburb || addr.quarter || addr.neighbourhood) {
        const area = addr.suburb || addr.quarter || addr.neighbourhood;
        if (!addressParts.includes(area)) {
          addressParts.push(area);
        }
      }
      
      // Niveau 3: Ville
      if (addr.city || addr.town || addr.village || addr.municipality) {
        addressParts.push(addr.city || addr.town || addr.village || addr.municipality);
      }
      
      // Si on a des parties d'adresse, les assembler
      if (addressParts.length > 0) {
        formattedAddress = addressParts.join(', ');
      } 
      // Sinon utiliser display_name nettoyé
      else if (data.display_name) {
        // Nettoyer display_name pour garder seulement les parties pertinentes
        const parts = data.display_name.split(',').slice(0, 3);
        formattedAddress = parts.join(',').trim();
      }
      // Dernier recours: utiliser le type de lieu
      else if (addr.amenity || addr.building || addr.place) {
        formattedAddress = addr.amenity || addr.building || addr.place;
        if (addr.city) formattedAddress += `, ${addr.city}`;
      }
      // Si vraiment rien, au moins mettre la ville ou le pays
      else {
        formattedAddress = addr.city || addr.state || addr.country || 'Localisation non définie';
      }

      setAddress(formattedAddress);
      setCoordinates({ lat, lng });
      onAddressSelect(formattedAddress, lat, lng);
    } catch (err) {
      console.error('Erreur de géocodage:', err);
      // En cas d'erreur, essayer un appel simplifié
      try {
        const simpleResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
          {
            headers: {
              'User-Agent': 'HypeMarketplace/1.0'
            }
          }
        );
        
        if (simpleResponse.ok) {
          const simpleData = await simpleResponse.json();
          const fallbackAddress = simpleData.display_name?.split(',').slice(0, 2).join(', ') || 'Abidjan, Côte d\'Ivoire';
          setAddress(fallbackAddress);
          setCoordinates({ lat, lng });
          onAddressSelect(fallbackAddress, lat, lng);
          setError('⚠️ Adresse approximative. Vous pouvez la préciser manuellement.');
          return;
        }
      } catch (retryErr) {
        console.error('Erreur lors de la tentative de récupération:', retryErr);
      }
      
      // Si tout échoue, utiliser une adresse générique basée sur la localisation
      const genericAddress = 'Abidjan, Côte d\'Ivoire';
      setAddress(genericAddress);
      setCoordinates({ lat, lng });
      onAddressSelect(genericAddress, lat, lng);
      setError('⚠️ Impossible de déterminer l\'adresse précise. Veuillez la saisir manuellement.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            const newAddress = e.target.value;
            setAddress(newAddress);
            // Mettre à jour le callback même en saisie manuelle
            if (coordinates) {
              onAddressSelect(newAddress, coordinates.lat, coordinates.lng);
            } else {
              // Si pas de coordonnées GPS, utiliser une position par défaut (Abidjan)
              onAddressSelect(newAddress, 5.3599517, -4.0082563);
            }
          }}
          placeholder="Adresse manuelle ou utilisez la géolocalisation"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span className="hidden sm:inline">Localisation...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span className="hidden sm:inline">Ma Position</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          error.includes('approximative') || error.includes('modifier')
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {error}
        </div>
      )}

      {showMap && (
        <div className="space-y-2">
          <div 
            id="map" 
            className="w-full h-64 rounded-lg border border-gray-300"
            style={{ zIndex: 0 }}
          />
          <p className="text-xs text-gray-500">
            💡 Déplacez le marqueur pour ajuster votre position exacte
          </p>
        </div>
      )}

      {coordinates && (
        <div className="text-xs text-gray-500">
          Coordonnées: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
