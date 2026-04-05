import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  sellerId = 1;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitted = false;
  message = '';
  messageType = '';

  categories: Category[] = [];

  product: Product = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    unit: '',
    isBio: false,
    isCertified: false,
    status: 'ACTIVE',
    category: { id: 0, name: '' }
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // ─── Validation ──────────────────────────────

  isNameInvalid(): boolean {
    return this.submitted && (!this.product.name || this.product.name.trim() === '');
  }

  isPriceInvalid(): boolean {
    return this.submitted && (!this.product.price || this.product.price <= 0);
  }

  isStockInvalid(): boolean {
    return this.submitted && (this.product.stockQuantity === undefined || this.product.stockQuantity < 0);
  }

  isUnitInvalid(): boolean {
    return this.submitted && (!this.product.unit || this.product.unit === '');
  }

  isCategoryInvalid(): boolean {
    return this.submitted && (!this.product.category?.id || this.product.category.id === 0);
  }

  isFormValid(): boolean {
    return (
      !!this.product.name &&
      this.product.name.trim() !== '' &&
      !!this.product.price &&
      this.product.price > 0 &&
      this.product.stockQuantity >= 0 &&
      !!this.product.unit &&
      !!this.product.category?.id &&
      this.product.category.id !== 0
    );
  }

  // ─── Actions ─────────────────────────────────

save(): void {
  this.submitted = true;
  if (!this.isFormValid()) {
    this.showMessage('Please fix the errors below ⚠️', 'error');
    return;
  }

  // Copie propre sans images
  const productToSend: any = {
    id: this.product.id,
    name: this.product.name,
    description: this.product.description,
    price: this.product.price,
    stockQuantity: this.product.stockQuantity,
    unit: this.product.unit,
    isBio: this.product.isBio,
    isCertified: this.product.isCertified,
    status: this.product.status,
    sellerId: this.product.sellerId,
    category: { id: this.product.category?.id }
  };

  if (this.isEditMode) {
    this.productService.update(productToSend, this.sellerId).subscribe({
      next: () => {
        this.showMessage('Product updated successfully ✅', 'success');
        setTimeout(() => this.router.navigate(['/seller/products']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error updating product ❌', 'error');
      }
    });
  } else {
    this.productService.create(productToSend, this.sellerId).subscribe({
  next: (createdProduct) => {
    this.showMessage('Product created ✅ — Add images now', 'success');
    // Rediriger vers Edit pour permettre l'upload
    setTimeout(() => 
      this.router.navigate(['/seller/products/edit', createdProduct.id])
    , 1000);
  },
  error: (err) => {
    console.error(err);
    this.showMessage('Error creating product ❌', 'error');
  }
});
  }
}

  cancel(): void {
    this.router.navigate(['/seller/products']);
  }

  onCategoryChange(event: any): void {
    this.product.category = { id: +event.target.value, name: '' };
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}