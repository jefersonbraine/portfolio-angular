import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;

  readonly isUploading = signal(false);
  readonly uploadProgress = signal(0);

  async uploadImage(file: File): Promise<string> {
    // Valida tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato inválido. Use JPG, PNG ou WebP.');
    }

    // Valida tamanho — máx 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Imagem muito grande. Máximo 5MB.');
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'portfolio');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem.');
      }

      const data = await response.json();
      return data.secure_url as string;
    } finally {
      this.isUploading.set(false);
      this.uploadProgress.set(0);
    }
  }
}
