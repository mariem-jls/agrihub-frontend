import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';
import { RessourceService } from '../../../core/services/ressource.service';
import {
  DemandeService,
  Demande,
} from '../../../core/services/demande.service';
import { Ressource } from '../../../core/models/ressource';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventService } from '../../../event/services/event.service';
import { ParticipationService } from '../../../event/services/participation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  sellerId = 1;

  events: any[] = [];
  participations: any[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  ressources: Ressource[] = [];
  demandes: Demande[] = [];

  isLoading = true;

  totalEvents = 0;
  totalParticipations = 0;
  pendingParticipations = 0;
  completEvents = 0;
  confirmedParticipations = 0;

  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  lowStockProducts = 0;

  // IA
  aiScore: number | null = null;
  aiSegment: string | null = null;
  aiAlerts: string[] = [];
  aiRecommendations: string[] = [];
  aiDetails: any = null;
  aiLoading = false;
  aiError: string | null = null;

  private aiLoaded = false;
  private dataReady = 0;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private ressourceService: RessourceService,
    private demandeService: DemandeService,
    private eventService: EventService,
    private participationService: ParticipationService,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
    this.loadRessources();
    this.loadDemandes();
    this.loadEvents();
    this.loadParticipations();
  }

  loadProducts(): void {
    this.productService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = data.length;

        this.lowStockProducts = data.filter(
          (p) =>
            p.stockQuantity !== undefined &&
            p.stockQuantity !== null &&
            p.stockQuantity < 5
        ).length;
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

  loadOrders(): void {
    this.orderService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.orders = data;
        this.totalOrders = data.length;

        this.pendingOrders = data.filter(
          (o) => o.status === 'PENDING'
        ).length;
      },
      error: (err) => console.error('Error loading orders', err),
    });
  }

  loadRessources(): void {
    this.ressourceService.getAll().subscribe({
      next: (data) => {
        this.ressources = data;
      },
      error: (err) =>
        console.error('Erreur chargement ressources', err),
    });
  }

  loadDemandes(): void {
    this.demandeService.getAll().subscribe({
      next: (data) => {
        this.demandes = data;
      },
      error: (err) =>
        console.error('Erreur chargement demandes', err),
    });
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: any[]) => {
        this.events = data ?? [];
        this.totalEvents = this.events.length;

        this.completEvents = this.events.filter(
          (e) => e.statut === 'COMPLET'
        ).length;

        this.isLoading = false;
        this.tryLoadAI();
      },
      error: (err) => {
        console.error('Erreur chargement events', err);
        this.isLoading = false;
      },
    });
  }

  loadParticipations(): void {
    this.participationService.getAllParticipations().subscribe({
      next: (data: any[]) => {
        this.participations = data ?? [];
        this.totalParticipations = this.participations.length;

        this.pendingParticipations = this.participations.filter(
          (p) => p.statut === 'EN_ATTENTE'
        ).length;

        this.confirmedParticipations = this.participations.filter(
          (p) => p.statut === 'CONFIRMEE'
        ).length;

        this.tryLoadAI();
      },
      error: (err) =>
        console.error('Erreur chargement participations', err),
    });
  }

  getRessourceName(ressourceId: number): string {
    const res = this.ressources.find((r) => r.id === ressourceId);
    return res ? res.nameR : 'Unknown';
  }

  tryLoadAI(): void {
    this.dataReady++;

    if (this.dataReady >= 2 && !this.aiLoaded) {
      this.aiLoaded = true;
      this.loadAI();
    }
  }

  loadAI(): void {
    this.aiLoading = true;
    this.aiError = null;

    const participationRate =
      this.totalParticipations > 0
        ? this.confirmedParticipations / this.totalParticipations
        : 0;

    const payload = {
      inscriptions_jour: Math.min(
        this.totalParticipations * 2,
        20
      ),
      events_recents: Math.min(this.totalEvents * 3, 10),
      actions_rapides: Math.min(
        this.confirmedParticipations,
        10
      ),
      email_suspect: 0,
      login_count: Math.max(
        this.totalParticipations + this.totalEvents,
        1
      ),
      participation_rate: parseFloat(
        participationRate.toFixed(2)
      ),
      total_participations: this.totalParticipations,
      confirmed_participations:
      this.confirmedParticipations,
      total_events: this.totalEvents,
      complet_events: this.completEvents,
    };

    this.http
      .post<any>('/AgriHub/api/ai/dashboard', payload)
      .subscribe({
        next: (res) => {
          this.aiScore = res.score;
          this.aiSegment = res.segment;
          this.aiAlerts = res.alerts ?? [];
          this.aiRecommendations =
            res.recommendations ?? [];
          this.aiDetails = res.details ?? null;
          this.aiLoading = false;
        },
        error: () => {
          this.aiError =
            "Impossible de charger l'analyse IA.";
          this.aiLoading = false;
        },
      });
  }

  get segmentColor(): string {
    if (!this.aiSegment) return '#6b7280';
    if (this.aiSegment.includes('HOT')) return '#e24b4a';
    if (this.aiSegment.includes('WARM')) return '#c9a84c';
    return '#378add';
  }

  get segmentBg(): string {
    if (!this.aiSegment) return '#f3f4f6';
    if (this.aiSegment.includes('HOT')) return '#fcebeb';
    if (this.aiSegment.includes('WARM')) return '#faeeda';
    return '#e6f1fb';
  }

  get scoreColor(): string {
    if (this.aiScore === null) return '#6b7280';
    if (this.aiScore >= 75) return '#e24b4a';
    if (this.aiScore >= 40) return '#c9a84c';
    return '#378add';
  }

  get scoreDashoffset(): number {
    if (this.aiScore === null) return 282;
    return 282 - (282 * this.aiScore) / 100;
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR');
  }

  statutClass(s: string): string {
    switch (s) {
      case 'CONFIRMEE':
        return 'b-confirmed';
      case 'REFUSEE':
        return 'b-cancelled';
      case 'EN_ATTENTE':
        return 'b-pending';
      case 'LISTE_ATTENTE':
        return 'b-preparing';
      default:
        return 'b-inactive';
    }
  }

  statutLabel(s: string): string {
    switch (s) {
      case 'CONFIRMEE':
        return 'Confirmée';
      case 'REFUSEE':
        return 'Refusée';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'LISTE_ATTENTE':
        return 'Liste attente';
      default:
        return s ?? '—';
    }
  }
}
