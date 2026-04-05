import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  sellerId = 1;
  products: Product[] = [];
  loading = false;
  message = '';
  messageType = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getBySeller(this.sellerId).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToAdd(): void {
    this.router.navigate(['/seller/products/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/seller/products/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id, this.sellerId).subscribe({
      next: () => {
        this.showMessage('Product deleted successfully ✅', 'success');
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error deleting product ❌', 'error');
      }
    });
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock < 5)  return 'stock-low';
    return 'stock-ok';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5)  return 'Low Stock';
    return 'In Stock';
  }
}