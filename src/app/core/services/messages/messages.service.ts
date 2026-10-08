import { Injectable, signal, computed } from '@angular/core';
import { AppMessage, MessageType } from '../../../shared/models/messages.model';
import { MESSAGE_CONFIG } from '../../../shared/constants/AppConstants';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesSignal = signal<AppMessage[]>([]);
  public readonly messages = computed(() => this.messagesSignal());

  public show(
    text: string,
    type: MessageType = 'danger',
    duration: number = MESSAGE_CONFIG.DEFAULT_DURATION,
  ): void {
    const id = crypto.randomUUID();
    const newMessage: AppMessage = { id, text, type, duration };

    this.messagesSignal.update((current) => [...current, newMessage]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  // Métodos de conveniencia usando la configuración centralizada
  public error(text: string, duration = MESSAGE_CONFIG.ERROR_DURATION): void {
    this.show(text, 'danger', duration);
  }

  public success(text: string, duration = MESSAGE_CONFIG.SUCCESS_DURATION): void {
    this.show(text, 'success', duration);
  }

  public info(text: string, duration = MESSAGE_CONFIG.INFO_DURATION): void {
    this.show(text, 'info', duration);
  }

  public warning(text: string, duration = MESSAGE_CONFIG.WARNING_DURATION): void {
    this.show(text, 'warning', duration);
  }

  public dismiss(id: string): void {
    this.messagesSignal.update((current) => current.filter((msg) => msg.id !== id));
  }

  public clearAll(): void {
    this.messagesSignal.set([]);
  }
}
