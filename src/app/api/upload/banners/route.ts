import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

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

    // Upload sur Cloudinary
    const result = await uploadImageToCloudinary(file) as any;
    // result.url contient l'URL de l'image hébergée
    return NextResponse.json({
      success: true,
      path: result.url,
      url: result.url,
      fileName: result.public_id
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
