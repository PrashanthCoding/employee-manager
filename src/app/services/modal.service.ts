import { Injectable, signal } from '@angular/core';

type ModalId = 'addModal' | 'editModal' | 'viewModal';

@Injectable({
  providedIn: 'root',
})
export class Modal {
  private modals = signal<Record<ModalId, boolean>>({
    addModal: false,
    editModal: false,
    viewModal: false,
  });

  isOpen(id: ModalId) {
    return this.modals()[id];
  }

  open(id: ModalId) {
    this.modals.update((m) => ({ ...m, [id]: true }));
    document.body.style.overflow = 'hidden';
  }

  close(id: ModalId) {
    this.modals.update((m) => ({ ...m, [id]: false }));
    document.body.style.overflow = '';
  }
}
