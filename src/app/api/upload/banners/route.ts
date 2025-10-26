import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Configuration pour permettre les uploads
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload banner - début');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('Aucun fichier dans la requête');
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log('Fichier reçu:', file.name, 'Type:', file.type, 'Taille:', file.size);

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Type non supporté:', file.type);
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez: JPG, PNG, GIF, WebP ou SVG' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 10MB pour les bannières)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('Fichier trop gros:', file.size);
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 10MB' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `banner-${timestamp}-${originalName}`;

    console.log('Nom du fichier:', fileName);

    // Créer le dossier si nécessaire avec permissions complètes
    const uploadDir = path.join(process.cwd(), 'public', 'banners');
    console.log('Dossier upload:', uploadDir);
    
    try {
      if (!existsSync(uploadDir)) {
        console.log('Création du dossier...');
        await mkdir(uploadDir, { recursive: true, mode: 0o777 });
        console.log('Dossier créé avec permissions complètes');
      }
    } catch (mkdirError: any) {
      console.error('Erreur création dossier:', mkdirError);
      return NextResponse.json(
        { error: `Impossible de créer le dossier: ${mkdirError.message}` },
        { status: 500 }
      );
    }

    // Convertir le fichier en buffer et sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    
    console.log('Sauvegarde du fichier:', filePath);
    try {
      await writeFile(filePath, buffer, { mode: 0o666 });
      console.log('Fichier sauvegardé avec succès');
    } catch (writeError: any) {
      console.error('Erreur écriture fichier:', writeError);
      return NextResponse.json(
        { error: `Impossible de sauvegarder le fichier: ${writeError.message}` },
        { status: 500 }
      );
    }

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
      { error: `Erreur serveur: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
