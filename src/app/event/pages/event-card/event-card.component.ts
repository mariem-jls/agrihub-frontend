import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AgriHubEvent } from '../../services/event.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {

  @Input() event!: AgriHubEvent;
  @Output() delete = new EventEmitter<void>();

  requestDelete() {
    const name = this.event?.nom ? ` "${this.event.nom}"` : '';
    if (confirm(`Supprimer l'événement${name} ?`)) {
      this.delete.emit();
    }
  }
}
