import { Component, inject } from '@angular/core';
import { MessagesService } from '../../../core/services/messages/messages.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  imports: [CommonModule, TranslatePipe],
  selector: 'app-messages',
  standalone: true,
  styleUrl: './messages.component.scss',
  templateUrl: './messages.component.html',
})
export class MessagesComponent {
  protected readonly messagesService: MessagesService = inject(MessagesService);
}
