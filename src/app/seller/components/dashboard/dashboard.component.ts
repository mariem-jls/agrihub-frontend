import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

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

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
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