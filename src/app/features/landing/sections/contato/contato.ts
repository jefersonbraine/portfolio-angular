import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

type IconName =
  | 'mail'
  | 'phone'
  | 'map-pin'
  | 'clock'
  | 'check-circle'
  | 'linkedin'
  | 'message-circle'
  | 'github';

type ContactInfoItem = {
  icon: IconName;
  title: string;
  value: string;
  subtitle: string;
};

type BenefitItem = {
  icon: IconName;
  text: string;
};

type SocialLink = {
  name: string;
  icon: IconName;
  href: string;
};

type FormField = 'name' | 'email' | 'phone' | 'priority' | 'subject' | 'message';

@Component({
  selector: 'app-contato',
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contato {
  private readonly fb = new FormBuilder();
  private readonly phonePattern = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
  private readonly allowedPriorities = ['baixa', 'media', 'alta'];

  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly isSwitchingToSuccess = signal(false);

  protected readonly contactInfo: ContactInfoItem[] = [
    {
      icon: 'mail',
      title: 'Email',
      value: 'jefersonbraineleal@gmail.com',
      subtitle: 'Respondo em ate 24 horas',
    },
    {
      icon: 'phone',
      title: 'Telefone',
      value: '(41) 99650-1459',
      subtitle: 'WhatsApp disponivel',
    },
    {
      icon: 'map-pin',
      title: 'Localizacao',
      value: 'Cerro Azul, Brasil',
      subtitle: 'Disponivel para projetos remotos',
    },
    {
      icon: 'clock',
      title: 'Horario',
      value: '9h as 18h',
      subtitle: 'Segunda a Sexta-feira',
    },
  ];

  protected readonly benefits: BenefitItem[] = [
    { icon: 'check-circle', text: 'Resposta rapida' },
    { icon: 'check-circle', text: 'Projetos de qualidade' },
    { icon: 'check-circle', text: 'Comunicacao clara' },
    { icon: 'check-circle', text: 'Prazos cumpridos' },
  ];

  protected readonly socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      href: 'https://linkedin.com/in/jefersonbraineleal',
    },
    {
      name: 'WhatsApp',
      icon: 'message-circle',
      href: 'https://wa.me/5541996501459',
    },
    {
      name: 'GitHub',
      icon: 'github',
      href: 'https://github.com/jefersonbraine',
    },
  ];

  protected readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        this.suspiciousContentValidator(),
      ],
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    phone: ['', [Validators.pattern(this.phonePattern), Validators.maxLength(20)]],
    priority: ['', [this.allowedOptionValidator(this.allowedPriorities)]],
    subject: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120),
        this.suspiciousContentValidator(),
      ],
    ],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000),
        this.suspiciousContentValidator(),
      ],
    ],
  });

  protected hasError(field: FormField, error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  protected hasInvalidField(field: FormField): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected hasMissingRequiredFields(): boolean {
    const requiredFields = [
      this.form.controls.name,
      this.form.controls.email,
      this.form.controls.subject,
      this.form.controls.message,
    ];

    return requiredFields.some((control) => control.touched && control.hasError('required'));
  }

  protected submit(): void {
    this.applyInputSanitization();

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    window.setTimeout(() => {
      this.isSubmitting.set(false);

      this.isSwitchingToSuccess.set(true);
      window.setTimeout(() => {
        this.isSwitchingToSuccess.set(false);
        this.isSubmitted.set(true);

        window.setTimeout(() => {
          this.isSubmitted.set(false);
          this.form.reset({
            name: '',
            email: '',
            phone: '',
            priority: '',
            subject: '',
            message: '',
          });
        }, 3000);
      }, 190);
    }, 1200);
  }

  private applyInputSanitization(): void {
    this.form.patchValue(
      {
        name: this.sanitizeText(this.form.controls.name.value),
        email: this.sanitizeText(this.form.controls.email.value).toLowerCase(),
        phone: this.sanitizeText(this.form.controls.phone.value),
        subject: this.sanitizeText(this.form.controls.subject.value),
        message: this.sanitizeText(this.form.controls.message.value),
      },
      { emitEvent: false },
    );

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private sanitizeText(value: string): string {
    return value
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/[<>]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private suspiciousContentValidator(): ValidatorFn {
    const suspiciousPattern = /<script|javascript:|data:|on\w+\s*=|<|>/i;

    return (control: AbstractControl<string>): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      return suspiciousPattern.test(value) ? { suspiciousContent: true } : null;
    };
  }

  private allowedOptionValidator(allowed: string[]): ValidatorFn {
    const allowedSet = new Set(allowed);

    return (control: AbstractControl<string>): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      return allowedSet.has(value) ? null : { invalidOption: true };
    };
  }
}
