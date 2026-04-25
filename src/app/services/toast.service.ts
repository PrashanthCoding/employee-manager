import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class Toast {
  private toastsSig = signal<ToastMessage[]>([]);
  public toasts = this.toastsSig.asReadonly();

  show(text: string, type: ToastMessage['type'] = 'info') {
    const id = Date.now();
    this.toastsSig.update((list) => [...list, { id, text, type }]);
    setTimeout(() => this.remove(id), 4500);
  }

  remove(id: number) {
    this.toastsSig.update((list) => list.filter((t) => t.id !== id));
  }
}
