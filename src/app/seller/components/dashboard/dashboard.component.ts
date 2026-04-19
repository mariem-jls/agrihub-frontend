import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';
import { RessourceService } from '../../../core/services/ressource.service';
import { DemandeService, Demande } from '../../../core/services/demande.service';
import { Ressource } from '../../../core/models/ressource';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ID vendeur en dur pour l'instant
  sellerId = 1;

  products: Product[] = [];
  orders: Order[] = [];

  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  lowStockProducts = 0;
 ressources: Ressource[] = [];
  demandes: Demande[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
      private ressourceService: RessourceService,
    private demandeService: DemandeService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
        this.loadRessources();
    this.loadDemandes();
  }
 loadRessources() {
    this.ressourceService.getAll().subscribe({
      next: (data) => this.ressources = data,
      error: (err) => console.error('Erreur chargement ressources', err)
    });
  }

  // 👇 Charger les demandes
  loadDemandes() {
    this.demandeService.getAll().subscribe({
      next: (data) => this.demandes = data,
      error: (err) => console.error('Erreur chargement demandes', err)
    });
  }

  // 👇 Fonction pour récupérer le nom de la ressource pour une demande
  getRessourceName(ressourceId: number): string {
    const res = this.ressources.find(r => r.id === ressourceId);
    return res ? res.nameR : 'Unknown';
  }
  loadProducts(): void {
    this.productService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = data.length;
        this.lowStockProducts = data.filter(
          p => p.stockQuantity !== undefined && p.stockQuantity < 5
        ).length;
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadOrders(): void {
    this.orderService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.orders = data;
        this.totalOrders = data.length;
        this.pendingOrders = data.filter(
          o => o.status === 'PENDING'
        ).length;
      },
      error: (err) => console.error('Error loading orders', err)
    });
  }
}