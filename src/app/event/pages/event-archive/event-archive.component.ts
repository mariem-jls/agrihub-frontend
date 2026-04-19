import { Component, OnInit } from '@angular/core';
import { AgriHubEvent, EventService } from '../../services/event.service';
import { Participation, ParticipationService } from '../../services/participation.service';

@Component({
  selector: 'app-event-archive',
  templateUrl: './event-archive.component.html',
  styleUrls: ['./event-archive.component.css'],
})
export class EventArchiveComponent implements OnInit {
  events: AgriHubEvent[] = [];
  isLoading = false;
  loadError: string | null = null;

  selectedEvent: AgriHubEvent | null = null;
  selectedParticipations: Participation[] = [];
  isLoadingParticipants = false;
  participantsError: string | null = null;

  // Recherche + filtres
  searchTerm = '';
  filterCategorie = '';
  filterStatut = '';

  categories = [
    'FOIRE_AGRICOLE', 'FORMATION', 'CONFERENCE', 'INVESTISSEMENT',
    'RECYCLAGE', 'ATELIER_PRATIQUE', 'MARCHE_LOCAL', 'INNOVATION_AGRO'
  ];

  // Tabs participants
  filterParticipantStatut = 'ALL';
  participantStatuts = ['ALL', 'EN_ATTENTE', 'CONFIRMEE', 'REFUSEE', 'LISTE_ATTENTE'];

  constructor(
    private eventService: EventService,
    private participationService: ParticipationService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.loadError = null;
    this.eventService.getArchivedEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Impossible de charger les archives.';
        this.isLoading = false;
      },
    });
  }

  get filteredEvents(): AgriHubEvent[] {
    return this.events.filter(e => {
      const matchSearch = !this.searchTerm ||
        e.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (e.adresse ?? '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = !this.filterCategorie || e.categorie === this.filterCategorie;
      const matchStatut = !this.filterStatut || e.statut === this.filterStatut;
      return matchSearch && matchCat && matchStatut;
    });
  }

  get filteredParticipants(): Participation[] {
    if (this.filterParticipantStatut === 'ALL') return this.selectedParticipations;
    return this.selectedParticipations.filter(p => p.statut === this.filterParticipantStatut);
  }

  countParticipantStatut(s: string): number {
    if (s === 'ALL') return this.selectedParticipations.length;
    return this.selectedParticipations.filter(p => p.statut === s).length;
  }

  voirParticipants(e: AgriHubEvent): void {
    if (e.id == null) return;
    this.selectedEvent = e;
    this.selectedParticipations = [];
    this.participantsError = null;
    this.isLoadingParticipants = true;
    this.filterParticipantStatut = 'ALL';
    this.participationService.getParticipationsByEvent(e.id).subscribe({
      next: (rows) => {
        this.selectedParticipations = rows;
        this.isLoadingParticipants = false;
      },
      error: () => {
        this.participantsError = 'Impossible de charger les participations.';
        this.isLoadingParticipants = false;
      },
    });
  }

  formatDate(s: string | undefined): string {
    if (!s) return '—';
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? s : d.toLocaleString('fr-FR');
  }
}