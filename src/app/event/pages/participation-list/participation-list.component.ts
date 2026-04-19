import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgriHubEvent, EventService } from '../../services/event.service';
import { Participation, ParticipationService } from '../../services/participation.service';

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css'],
})
export class ParticipationListComponent implements OnInit {
  participations: Participation[] = [];
  events: AgriHubEvent[] = [];
  filterEventId: number | null = null;
  isLoading = false;
  actionError: string | null = null;
  busyId: number | null = null;

  activeTab: 'active' | 'archive' = 'active';
  filterStatut = 'ALL';

  statuts = ['ALL', 'EN_ATTENTE', 'CONFIRMEE', 'REFUSEE', 'LISTE_ATTENTE'];

  // Modals
  confirmModalOpen = false;
  refuseModalOpen = false;
  selected: Participation | null = null;
  confirmMessage = '';
  refuseReason: 'CONTACT' | 'DOUBLE' | 'AUTRE' | null = null;
  refuseOtherText = '';

  constructor(
    private participationService: ParticipationService,
    private eventService: EventService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('eventId');
    if (q != null && q !== '') {
      const n = Number(q);
      if (!Number.isNaN(n)) this.filterEventId = n;
    }
    this.reload();
  }

  reload(): void {
    this.isLoading = true;
    this.actionError = null;
    forkJoin({
      events: this.eventService.getAllEvents(),
      archives: this.eventService.getArchivedEvents(),
    }).subscribe({
      next: ({ events, archives }) => {
        const map = new Map<number, AgriHubEvent>();
        for (const e of [...events, ...archives]) {
          if (e.id != null) map.set(e.id, e);
        }
        this.events = Array.from(map.values()).sort((a, b) =>
          (a.nom ?? '').localeCompare(b.nom ?? '', 'fr'),
        );
        this.participationService.getAllParticipations().subscribe({
          next: (rows) => {
            this.participations = rows;
            this.isLoading = false;
            console.log(rows);
          },
          error: () => {
            this.actionError = 'Impossible de charger les participations.';
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.actionError = 'Impossible de charger les événements.';
        this.isLoading = false;
      },
    });
  }



  searchEvent = '';

get filteredRows() {
  return this.participations.filter(p => {
    const isArchive = p.statut === 'REFUSEE';
    const tabMatch = this.activeTab === 'archive' ? isArchive : !isArchive;
    
    // ← Fix : mapper LISTE_ATTENTE → EN_ATTENTE_LISTE
    const mapped = this.filterStatut === 'LISTE_ATTENTE' ? 'EN_ATTENTE_LISTE' : this.filterStatut;
    const statutMatch = this.filterStatut === 'ALL' || p.statut === mapped;
    
    const search = this.searchEvent.toLowerCase();
    const searchMatch = !search ||
      this.eventName(p).toLowerCase().includes(search) ||
      (p.nomComplet ?? '').toLowerCase().includes(search) ||
      (p.email ?? '').toLowerCase().includes(search);
    return tabMatch && statutMatch && searchMatch;
  });
}





  countByStatut(s: string) {
    const mapped = s === 'LISTE_ATTENTE' ? 'EN_ATTENTE_LISTE' : s;
    return this.participations.filter((p) => (s === 'ALL' ? true : p.statut === mapped)).length;
  }

  rowEventId(p: Participation): number | undefined {
    return p.event?.id ?? p.eventId;
  }

  eventName(p: Participation): string {
    const id = this.rowEventId(p);
    if (id != null) {
      const ev = this.events.find((e) => e.id === id);
      if (ev?.nom) return ev.nom;
    }
    return p.event?.nom ?? '—';
  }

  eventStatut(p: Participation): string | undefined {
    const id = this.rowEventId(p);
    if (id != null) {
      const ev = this.events.find((e) => e.id === id);
      if (ev?.statut != null) return ev.statut;
    }
    return p.event?.statut;
  }

  statutClass(statut: string | undefined): string {
    switch (statut) {
      case 'CONFIRMEE':
        return 'badge-confirme';
      case 'REFUSEE':
        return 'badge-refuse';
      case 'EN_ATTENTE':
        return 'badge-attente';
      case 'EN_ATTENTE_LISTE':
        return 'badge-liste';
      default:
        return 'badge-default';
    }
  }

  statutLabel(statut: string | undefined): string {
    switch (statut) {
      case 'REFUSEE':
        return 'REFUSÉE';
      case 'CONFIRMEE':
        return 'CONFIRMÉE';
      case 'EN_ATTENTE_LISTE':
        return 'LISTE D’ATTENTE';
      case 'EN_ATTENTE':
        return 'EN ATTENTE';
      default:
        return statut ?? '—';
    }
  }

  canConfirmOrRefuse(p: Participation): boolean {
    const s = p.statut;
    return s === 'EN_ATTENTE' || s === 'EN_ATTENTE_LISTE';
  }

  canDeleteOnly(p: Participation): boolean {
    return p.statut === 'REFUSEE';
  }

  isConfirmedOnly(p: Participation): boolean {
    return p.statut === 'CONFIRMEE';
  }

  setBusy(id: number | null): void {
    this.busyId = id;
  }

  openConfirm(p: Participation): void {
    if (p.id == null) return;
    this.selected = p;
    this.confirmMessage = '';
    this.confirmModalOpen = true;
  }

  cancelConfirm(): void {
    this.confirmModalOpen = false;
    this.selected = null;
    this.confirmMessage = '';
  }

  submitConfirm(): void {
    const p = this.selected;
    if (!p?.id) return;
    this.actionError = null;
    this.setBusy(p.id);
    this.participationService.confirmerParticipation(p.id, this.confirmMessage).subscribe({
      next: () => {
        this.setBusy(null);
        this.confirmModalOpen = false;
        this.selected = null;
        this.confirmMessage = '';
        this.reload();
      },
      error: () => {
        this.actionError = 'Échec de la confirmation.';
        this.setBusy(null);
      },
    });
  }

  openRefuse(p: Participation): void {
    if (p.id == null) return;
    this.selected = p;
    this.refuseReason = null;
    this.refuseOtherText = '';
    this.refuseModalOpen = true;
  }

  cancelRefuse(): void {
    this.refuseModalOpen = false;
    this.selected = null;
    this.refuseReason = null;
    this.refuseOtherText = '';
  }

  get refuseCause(): string | null {
    if (this.refuseReason === 'CONTACT') return 'Informations de contact incorrectes';
    if (this.refuseReason === 'DOUBLE') return 'Inscription en double détectée';
    if (this.refuseReason === 'AUTRE') {
      const t = this.refuseOtherText.trim();
      return t ? t : null;
    }
    return null;
  }

  submitRefuse(): void {
    const p = this.selected;
    if (!p?.id) return;
    const cause = this.refuseCause;
    if (!cause) return;
    this.actionError = null;
    this.setBusy(p.id);
    this.participationService.refuserParticipation(p.id, cause).subscribe({
      next: () => {
        this.setBusy(null);
        this.refuseModalOpen = false;
        this.selected = null;
        this.refuseReason = null;
        this.refuseOtherText = '';
        this.reload();
      },
      error: () => {
        this.actionError = 'Échec du refus.';
        this.setBusy(null);
      },
    });
  }

  supprimer(p: Participation): void {
    if (p.id == null) return;
    if (!confirm('Supprimer cette participation ?')) return;
    this.actionError = null;
    this.setBusy(p.id);
    this.participationService.deleteParticipation(p.id).subscribe({
      next: () => {
        this.setBusy(null);
        this.reload();
      },
      error: () => {
        this.actionError = 'Échec de la suppression.';
        this.setBusy(null);
      },
    });
  }

  formatDate(s: string | undefined): string {
    if (!s) return '—';
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? s : d.toLocaleString('fr-FR');
  }
}
