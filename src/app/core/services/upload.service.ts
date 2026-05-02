import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

// Token para avisar aos interceptores para ignorarem esta requisição
export const BYPASS_INTERCEPTORS = new HttpContextToken(() => false);

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly functions = inject(Functions);

  private readonly isUploadingSubject = new BehaviorSubject<boolean>(false);
  public readonly isUploading = this.isUploadingSubject.asObservable();

  async uploadImage(file: File): Promise<string> {
    this.isUploadingSubject.next(true);

    try {
      // 1. Pede a assinatura (Chama a Cloud Function)
      const getSignatureFn = httpsCallable(this.functions, 'getCloudinarySignature');
      const { data } = (await getSignatureFn()) as any;

      // 2. Prepara o FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', data.apiKey);
      formData.append('timestamp', data.timestamp.toString());
      formData.append('signature', data.signature);
      formData.append('folder', data.folder);

      // 3. Faz o POST para o Cloudinary ignorando headers globais
      const response = await firstValueFrom(
        this.http.post<any>(
          `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
          formData,
          {
            // Usamos o context para sinalizar ao interceptor
            context: new HttpContext().set(BYPASS_INTERCEPTORS, true),
          },
        ),
      );

      return response.secure_url;
    } catch (error) {
      console.error('Erro no upload seguro:', error);
      throw error;
    } finally {
      this.isUploadingSubject.next(false);
    }
  }
}
