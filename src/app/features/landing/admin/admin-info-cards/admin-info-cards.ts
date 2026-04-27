import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type InfoCardColor = 'teal' | 'violet' | 'amber' | 'rose';

type AdminInfoCardItem = {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: InfoCardColor;
  order: number;
};

type InfoCardForm = {
  title: string;
  content: string;
  icon: string;
  color: InfoCardColor;
  order: number;
};

const EMPTY_FORM: InfoCardForm = {
  title: '',
  content: '',
  icon: '',
  color: 'teal',
  order: 0,
};

@Component({
  selector: 'app-admin-info-cards',
  imports: [],
  templateUrl: './admin-info-cards.html',
  styleUrl: './admin-info-cards.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInfoCards {
  protected readonly cards = signal<AdminInfoCardItem[]>([]);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly form = signal<InfoCardForm>({ ...EMPTY_FORM });

  protected openNewForm(): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.update((value) => !value);
  }

  protected openEdit(card: AdminInfoCardItem): void {
    this.editingId.set(card.id);
    this.form.set({
      title: card.title,
      content: card.content,
      icon: card.icon,
      color: card.color,
      order: card.order,
    });
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
  }

  protected setField<K extends keyof InfoCardForm>(field: K, value: InfoCardForm[K]): void {
    this.form.update((state) => ({ ...state, [field]: value }));
  }

  protected submitForm(event: Event): void {
    event.preventDefault();

    const current = this.form();
    if (!current.title.trim() || !current.content.trim()) {
      return;
    }

    const payload: AdminInfoCardItem = {
      id: this.editingId() ?? `card-${Date.now()}`,
      title: current.title.trim(),
      content: current.content.trim(),
      icon: current.icon.trim(),
      color: current.color,
      order: Number.isFinite(current.order) ? current.order : 0,
    };

    const editingId = this.editingId();
    if (editingId) {
      this.cards.update((list) => list.map((item) => (item.id === editingId ? payload : item)));
    } else {
      this.cards.update((list) => [payload, ...list]);
    }

    this.form.set({ ...EMPTY_FORM });
    this.editingId.set(null);
    this.showForm.set(false);
  }

  protected deleteCard(id: string): void {
    this.cards.update((list) => list.filter((item) => item.id !== id));
  }

  protected getCardClass(color: InfoCardColor): string {
    switch (color) {
      case 'teal':
        return 'border-teal-500/30 text-teal-400';
      case 'violet':
        return 'border-violet-500/30 text-violet-400';
      case 'amber':
        return 'border-amber-500/30 text-amber-400';
      default:
        return 'border-rose-500/30 text-rose-400';
    }
  }
}
