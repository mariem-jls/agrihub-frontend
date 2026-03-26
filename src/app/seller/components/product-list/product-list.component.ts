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
  filteredProducts: Product[] = [];
  loading = false;
  message = '';
  messageType = '';

  viewMode: 'table' | 'grid' = 'table';
  searchQuery = '';
  selectedCategory = '';
  selectedStock = '';
  bioOnly = false;
  categories: string[] = [];

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
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    const cats = this.products
      .map(p => p.category?.name)
      .filter((c): c is string => !!c);
    this.categories = [...new Set(cats)];
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory) {
      result = result.filter(p => p.category?.name === this.selectedCategory);
    }

    if (this.selectedStock) {
      result = result.filter(p => this.getStockClass(p.stockQuantity) === this.selectedStock);
    }

    if (this.bioOnly) {
      result = result.filter(p => p.isBio);
    }

    this.filteredProducts = result;
  }

  goToAdd(): void {
    this.router.navigate(['/seller/products/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/seller/products/edit', id]);
  }

  toggleStatus(product: Product): void {
    const updated = {
      ...product,
      status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    };
    this.productService.update(updated as Product, this.sellerId).subscribe({
      next: () => {
        this.showMessage(
          `Product ${updated.status === 'ACTIVE' ? 'activated' : 'deactivated'}`,
          'success'
        );
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error updating status', 'error');
      }
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'out';
    if (stock < 5)  return 'low';
    return 'ok';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5)  return 'Low Stock';
    return 'In Stock';
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}