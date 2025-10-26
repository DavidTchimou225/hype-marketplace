'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  link: string | null;
  order: number;
}

export default function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Erreur lors du chargement des bannières:', error);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (banners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Change toutes les 5 secondes

      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [banners.length, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset auto-play
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  if (!banners || banners.length === 0) {
    // Bannière par défaut si aucune n'est configurée
    return (
      <div className="px-4 py-6">
        <div className="relative h-64 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Mode Ivoirienne</h2>
            <p className="text-lg opacity-90">Découvrez les plus belles créations</p>
          </div>
        </div>
      </div>
    );
  }

  const BannerContent = ({ banner }: { banner: Banner }) => (
    <div className="relative h-64 rounded-2xl overflow-hidden">
      <img
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
        {banner.description && (
          <p className="text-sm opacity-90">{banner.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="min-w-full">
                {banner.link ? (
                  <Link href={banner.link}>
                    <BannerContent banner={banner} />
                  </Link>
                ) : (
                  <BannerContent banner={banner} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (Desktop) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + banners.length) % banners.length
                )
              }
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Précédent"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Suivant"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Aller à la bannière ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
