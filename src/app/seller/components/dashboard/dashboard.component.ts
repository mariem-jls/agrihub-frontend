import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../event/services/event.service';
import { ParticipationService } from '../../../event/services/participation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  events: any[] = [];
  participations: any[] = [];

  totalEvents = 0;
  totalParticipations = 0;
  pendingParticipations = 0;
  completEvents = 0;

  isLoading = true;

  constructor(
    private eventService: EventService,
    private participationService: ParticipationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadParticipations();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: any[]) => {
        this.events = data ?? [];
        this.totalEvents = this.events.length;
        this.completEvents = this.events.filter(e => e.statut === 'COMPLET').length;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadParticipations(): void {
    this.participationService.getAllParticipations().subscribe({
      next: (data: any[]) => {
        this.participations = data ?? [];
        this.totalParticipations = this.participations.length;
        this.pendingParticipations = this.participations.filter(
          p => p.statut === 'EN_ATTENTE'
        ).length;
      },
      error: () => {}
    });
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR');
  }

  statutClass(s: string): string {
    switch (s) {
      case 'CONFIRMEE':     return 'b-confirmed';
      case 'REFUSEE':       return 'b-cancelled';
      case 'EN_ATTENTE':    return 'b-pending';
      case 'LISTE_ATTENTE': return 'b-preparing';
      default:              return 'b-inactive';
    }
  }

  statutLabel(s: string): string {
    switch (s) {
      case 'CONFIRMEE':     return 'Confirmée';
      case 'REFUSEE':       return 'Refusée';
      case 'EN_ATTENTE':    return 'En attente';
      case 'LISTE_ATTENTE': return 'Liste attente';
      default: return s ?? '—';
    }
  }
}