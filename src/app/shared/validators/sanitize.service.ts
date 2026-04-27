import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SanitizeService {
  sanitizeText(value: string): string {
    return value
      .replace(/<[^>]*>/g, '') // Remove tags HTML
      .replace(/javascript:/gi, '') // Remove js: em atributos
      .replace(/on\w+\s*=/gi, '') // Remove eventos inline (onclick=, onload=...)
      .trim();
  }

  sanitizeUrl(url: string): string {
    const allowed = /^https?:\/\//i;
    if (!allowed.test(url)) return '';
    return url.trim();
  }

  sanitizeProject(project: any): any {
    return {
      name: this.sanitizeText(project.name),
      description: this.sanitizeText(project.description),
      codeUrl: this.sanitizeUrl(project.codeUrl),
      demoUrl: this.sanitizeUrl(project.demoUrl),
      videoUrl: this.sanitizeUrl(project.videoUrl),
      docUrl: this.sanitizeUrl(project.docUrl),
      tags: (project.tags || []).map((tag: string) => this.sanitizeText(tag)),
    };
  }

  sanitizeCourse(course: any): any {
    return {
      title: this.sanitizeText(course.title),
      provider: this.sanitizeText(course.provider),
      description: this.sanitizeText(course.description ?? ''),
      certificate: this.sanitizeUrl(course.certificate ?? ''),
      certificateUrl: this.sanitizeUrl(course.certificateUrl ?? ''),
    };
  }
}
