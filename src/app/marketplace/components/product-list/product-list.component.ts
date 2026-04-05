import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filtered: Product[] = [];
  categories: Category[] = [];
  cart: { product: Product, qty: number }[] = [];

  searchKeyword = '';
  selectedCategory = 0;
  showBioOnly = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.status === 'ACTIVE');
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  applyFilters(): void {
    this.filtered = this.products.filter(p => {
      const matchKeyword = !this.searchKeyword ||
        p.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchCategory = !this.selectedCategory ||
        p.category?.id === this.selectedCategory;
      const matchBio = !this.showBioOnly || p.isBio;
      return matchKeyword && matchCategory && matchBio;
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/marketplace/product', id]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    const existing = this.cart.find(i => i.product.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ product, qty: 1 });
    }
  }

  get cartCount(): number {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  }

  goToCheckout(): void {
    this.router.navigate(['/marketplace/checkout'], {
      state: { cart: this.cart }
    });
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = 0;
    this.showBioOnly = false;
    this.applyFilters();
  }
}