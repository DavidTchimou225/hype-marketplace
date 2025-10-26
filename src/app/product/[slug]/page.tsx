import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClient from './ProductClient';
import { prisma } from '@/lib/prisma';

// Génération des métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        store: { select: { name: true } },
        categories: { select: { name: true } }
      }
    });

    if (!product) {
      return {
        title: 'Produit non trouvé',
        description: 'Ce produit n\'est plus disponible sur Hype Market'
      };
    }

    const price = (product.price / 100).toLocaleString('fr-FR');
    const images = product.images.split(',').filter(img => img.trim());
    const categoryNames = product.categories.map(c => c.name).join(', ');

    return {
      title: `${product.name} - ${product.store.name}`,
      description: `${product.description.substring(0, 155)}... Prix: ${price} FCFA. Disponible sur Hype Market, la marketplace N°1 de mode africaine en Côte d'Ivoire.`,
      keywords: [product.name, product.store.name, categoryNames, 'hype', 'streetwear', 'hype marketplace', 'marketplace', 'mode ivoirienne', 'late', 'choco', 'mode africaine', 'Côte d\'Ivoire', 'Abidjan', 'wax', 'bogolan'],
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 200),
        type: 'website',
        url: `https://hypemarket.ci/product/${product.slug}`,
        images: images.map(img => ({
          url: img.startsWith('http') ? img : `https://hypemarket.ci${img}`,
          width: 800,
          height: 600,
          alt: product.name
        })),
        siteName: 'Hype Market',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description.substring(0, 200),
        images: images.slice(0, 1).map(img => img.startsWith('http') ? img : `https://hypemarket.ci${img}`),
      },
      alternates: {
        canonical: `https://hypemarket.ci/product/${product.slug}`
      }
    };
  } catch (error) {
    console.error('Erreur génération métadonnées:', error);
    return {
      title: 'Hype Market',
      description: 'Marketplace de mode africaine'
    };
  }
}

// Génération statique des paramètres
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true
      }
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: params.slug,
        isActive: true
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviews: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      notFound();
    }

    // Serialize the product data
    const serializedProduct = {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      reviews: product.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString()
      }))
    };

    return <ProductClient product={serializedProduct} />;
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error);
    notFound();
  }
}
