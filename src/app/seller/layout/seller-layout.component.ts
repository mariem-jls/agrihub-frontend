import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-seller-layout',
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.css']
})
export class SellerLayoutComponent implements OnInit {
  pendingCount = 0;
  sidebarCollapsed = false;
  
  seller = {
    id: 1,
    name: 'Mariem Jlassi',
    farmName: 'Ferme El Khir',
    region: 'Nabeul',
    avatar: null,
    email: 'mariem@agrihub.tn'
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadPendingCount();
  }

  loadPendingCount(): void {
    this.orderService.getBySeller(this.seller.id).subscribe({
      next: (orders: Order[]) => {
        this.pendingCount = orders.filter((o: Order) => o.status === 'PENDING').length;
      },
      error: (err: Error) => {
        console.error('Failed to load pending count', err);
      }
    });
  }

  getInitials(): string {
    return this.seller.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    console.log('Logout — à implémenter avec auth');
  }
}