import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  sellerId = 1;
  orders: Order[] = [];
  loading = false;
  message = '';
  messageType = '';

  // Pipeline des statuts dans l'ordre
  pipeline: OrderStatus[] = [
    'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Statut suivant dans le pipeline
  getNextStatus(current: OrderStatus): OrderStatus | null {
    const index = this.pipeline.indexOf(current);
    if (index === -1 || index === this.pipeline.length - 1) return null;
    return this.pipeline[index + 1];
  }

  // Avancer le statut
  advanceStatus(order: Order): void {
    const next = this.getNextStatus(order.status!);
    if (!next) return;

    this.orderService.updateStatus(
      order.id!,
      this.sellerId,
      next
    ).subscribe({
      next: () => {
        this.showMessage(
          `Order ${order.orderNumber} → ${next} ✅`,
          'success'
        );
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error updating order status ❌', 'error');
      }
    });
  }

  // Annuler une commande
  cancelOrder(order: Order): void {
    if (!confirm(`Cancel order ${order.orderNumber} ?`)) return;

    this.orderService.cancel(
      order.id!,
      this.sellerId,
      'Cancelled by seller'
    ).subscribe({
      next: () => {
        this.showMessage(
          `Order ${order.orderNumber} cancelled ✅`,
          'success'
        );
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error cancelling order ❌', 'error');
      }
    });
  }

  // Progression pipeline en %
  getPipelineProgress(status: OrderStatus): number {
    if (status === 'CANCELLED') return 0;
    const index = this.pipeline.indexOf(status);
    return Math.round((index / (this.pipeline.length - 1)) * 100);
  }

  // Vérifier si un step est atteint
  isStepDone(orderStatus: OrderStatus, step: OrderStatus): boolean {
    const orderIndex = this.pipeline.indexOf(orderStatus);
    const stepIndex  = this.pipeline.indexOf(step);
    return orderIndex > stepIndex;
  }

  isStepCurrent(orderStatus: OrderStatus, step: OrderStatus): boolean {
    return orderStatus === step;
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  // Filtre par statut pour l'affichage
  filterByStatus(status: string): Order[] {
    if (status === 'ALL') return this.orders;
    return this.orders.filter(o => o.status === status);
  }

  selectedFilter = 'ALL';

  setFilter(status: string): void {
    this.selectedFilter = status;
  }

  get filteredOrders(): Order[] {
    return this.filterByStatus(this.selectedFilter);
  }
}