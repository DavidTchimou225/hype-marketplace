import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const storeId = store.id;

    const products = await prisma.product.findMany({
      where: { storeId },
      include: {
        categories: true,
        store: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const storeId = store.id;
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let description = '';
    let price: any = 0;
    let images: any = '';
    let colors: any = '';
    let sizes: any = '';
    let stock: any = 0;
    let categoryIds: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      name = String(form.get('name') || '');
      description = String(form.get('description') || '');
      price = Number(form.get('price') || 0);
      colors = String(form.get('colors') || '');
      sizes = String(form.get('sizes') || '');
      stock = Number(form.get('stock') || 0);
      // categories: accept multiple selects: categoryIds[], also keep categoryId for backward compatibility
      const ids = form.getAll('categoryIds').map(String).filter(Boolean);
      const singleId = form.get('categoryId');
      if (ids.length) categoryIds = ids;
      else if (singleId) categoryIds = [String(singleId)];

      // handle files: accept 'image' or 'images'
      const uploadedPaths: string[] = [];
      const maybeFiles: any[] = [];
      const single = form.get('image');
      if (single) maybeFiles.push(single);
      const multi = form.getAll('images');
      if (multi && multi.length) maybeFiles.push(...multi);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      await mkdir(uploadDir, { recursive: true });
      for (const f of maybeFiles) {
        if (typeof f === 'object' && 'arrayBuffer' in f) {
          const file = f as File;
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const safeName = `${Date.now()}-${(file.name || 'image').replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
          const fullPath = path.join(uploadDir, safeName);
          await writeFile(fullPath, buffer);
          uploadedPaths.push(`/uploads/products/${safeName}`);
        }
      }
      images = uploadedPaths.join(',');
    } else {
      // JSON fallback
      const body = await request.json();
      name = body.name;
      description = body.description;
      price = body.price;
      images = body.images || '';
      colors = body.colors || '';
      sizes = body.sizes || '';
      stock = body.stock;
      categoryIds = Array.isArray(body.categoryIds)
        ? body.categoryIds.map((v: any) => String(v)).filter(Boolean)
        : (body.categoryId ? [String(body.categoryId)] : []);
    }

    // Basic validation
    const errors: string[] = [];
    if (!name || name.trim().length === 0) errors.push('Le nom du produit est requis');
    if (!description || description.trim().length === 0) errors.push('La description est requise');
    if (!categoryIds || categoryIds.length === 0) errors.push('Au moins une catégorie est requise');
    if (isNaN(Number(price)) || Number(price) <= 0) errors.push('Prix invalide');
    if (isNaN(Number(stock)) || Number(stock) < 0) errors.push('Stock invalide');
    if (!images || (Array.isArray(images) ? images.length === 0 : String(images).trim().length === 0)) {
      errors.push('Au moins une image est requise');
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' · ') }, { status: 400 });
    }

    // Validate category exists
    const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
    if (categories.length !== categoryIds.length) {
      return NextResponse.json({ error: 'Une ou plusieurs catégories sont introuvables' }, { status: 400 });
    }

    // Générer un slug unique
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        description,
        price: Math.round(Number(price) * 100), // Convertir en centimes
        images: Array.isArray(images) ? images.join(',') : images,
        colors: Array.isArray(colors) ? colors.join(',') : colors,
        sizes: Array.isArray(sizes) ? sizes.join(',') : sizes,
        stock: Number(stock),
        storeId,
        isActive: true
      },
      include: {
        categories: true,
        store: true,
      }
    });

    // Connect categories in a separate update to avoid type diffs across client versions
    await prisma.product.update({
      where: { id: product.id },
      data: { categories: { set: [], connect: categoryIds.map((id) => ({ id })) } }
    });

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
