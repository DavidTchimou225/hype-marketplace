import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Vérifier les droits admin
    try {
      requireAdmin(request);
    } catch (error) {
      console.error('Erreur auth:', error);
      return NextResponse.json(
        { error: 'Accès non autorisé - Veuillez vous reconnecter' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez: JPG, PNG, GIF, WebP ou SVG' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 10MB pour les bannières)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 10MB' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `banner-${timestamp}-${originalName}`;

    // Créer le dossier si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'banners');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convertir le fichier en buffer et sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    // Retourner le chemin public
    const publicPath = `/banners/${fileName}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      url: publicPath,
      fileName: fileName
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: `Erreur lors de l'upload: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
