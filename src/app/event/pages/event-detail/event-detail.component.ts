import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, AgriHubEvent } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  /** Libellés pour l'affichage (enum Spring = nom en MAJ). */
  readonly categoryLabels: Record<string, string> = {
    FOIRE_AGRICOLE: 'Foire agricole',
    FORMATION: 'Formation',
    CONFERENCE: 'Conférence',
    INVESTISSEMENT: 'Investissement',
    RECYCLAGE: 'Recyclage',
    ATELIER_PRATIQUE: 'Atelier pratique',
    MARCHE_LOCAL: 'Marché local',
    INNOVATION_AGRO: 'Innovation agro',
  };

  event?: AgriHubEvent;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id || Number.isNaN(id)) {
      this.error = 'Identifiant invalide';
      this.isLoading = false;
      return;
    }

    this.eventService.getEventById(id).subscribe({
      next: (ev) => {
        this.event = ev;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Événement introuvable';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/event']);
  }

  edit() {
    if (!this.event?.id) { return; }
    this.router.navigate(['/event/edit', this.event.id]);
  }
}

