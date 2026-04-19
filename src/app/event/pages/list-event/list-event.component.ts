import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, AgriHubEvent } from '../../services/event.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit {

  events: AgriHubEvent[] = [];
  // Recherche / filtres
  searchTerm = '';
  filterCategorie = '';
  filterStatut = '';

  // Mode d'affichage
  viewMode: 'list' | 'grid' = 'list';

  categories = [
    'FOIRE_AGRICOLE',
    'FORMATION',
    'CONFERENCE',
    'INVESTISSEMENT',
    'RECYCLAGE',
    'ATELIER_PRATIQUE',
    'MARCHE_LOCAL',
    'INNOVATION_AGRO',
  ];

  successMsg: string | null = null;
  errorMsg: string | null = null;
  isLoading = false;
  archivingId: number | null = null;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  goAdd(): void {
    this.router.navigate(['/event/add']);
  }

  goDetail(id: number | undefined): void {
    if (id == null) return;
    this.router.navigate(['/event/detail', id]);
  }

  goEdit(id: number | undefined): void {
    if (id == null) return;
    this.router.navigate(['/event/edit', id]);
  }

  confirmDelete(e: AgriHubEvent): void {
    if (e.id == null) return;
    if (!confirm('Supprimer cet événement ?')) return;

    this.successMsg = null;
    this.errorMsg = null;
    this.isLoading = true;

    this.eventService.deleteEvent(e.id).subscribe({
      next: () => {
        this.successMsg = 'Événement supprimé.';
        this.isLoading = false;
        this.loadEvents();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Échec de la suppression.';
        this.isLoading = false;
      },
    });
  }

  getImageUrl(image: string | undefined): string {
    if (!image) return '';
    return `http://localhost:8089/AgriHub/api/events/image/${image}`;
  }

  archiver(e: AgriHubEvent): void {
    if (e.id == null) return;
    if (!confirm('Archiver cet événement ? Il disparaîtra de cette liste et apparaîtra dans les archives.')) return;
    this.archivingId = e.id;
    this.eventService.archiverEvent(e.id).subscribe({
      next: () => {
        this.archivingId = null;
        this.loadEvents();
      },
      error: () => {
        this.archivingId = null;
      },
    });
  }

  get filteredEvents(): AgriHubEvent[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.events.filter((e) => {
      const matchSearch =
        !term ||
        (e.nom ?? '').toLowerCase().includes(term) ||
        (e.adresse ?? '').toLowerCase().includes(term);
      const matchCat = !this.filterCategorie || e.categorie === this.filterCategorie;
      const matchStatut = !this.filterStatut || e.statut === this.filterStatut;
      return !e.archive && matchSearch && matchCat && matchStatut;
    });
  }
}