'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  // Ne pas afficher la navigation bottom sur les pages admin et boutique
  if (pathname.startsWith('/admin') || pathname.startsWith('/boutique')) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      icon: '🏠',
      label: 'Accueil',
      active: pathname === '/'
    },
    {
      href: '/categories',
      icon: '📱',
      label: 'Catégories',
      active: pathname === '/categories' || pathname.startsWith('/category/')
    },
    {
      href: '/lives',
      icon: '📺',
      label: 'Live',
      active: pathname === '/lives' || pathname.startsWith('/lives/watch')
    },
    {
      href: '/boutiques',
      icon: '🏪',
      label: 'Boutiques',
      active: pathname === '/boutiques' || pathname.startsWith('/store/')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              item.active
                ? 'text-black bg-gray-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
