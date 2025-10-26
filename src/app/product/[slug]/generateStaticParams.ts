import { prisma } from '../../../../lib/prisma'

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true
      }
    })

    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error)
    return []
  }
}
