export type MessageType = 'success' | 'info' | 'warning' | 'danger';

export interface AppMessage {
  id: string;
  text: string;
  type: MessageType;
  duration?: number; // tiempo en ms para auto-cerrarse (opcional)
}
