import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  buyerId = 2;
  product: Product | null = null;
  reviews: Review[] = [];
  averageRating = 0;
  loading = false;
  message = '';
  messageType = '';
  selectedImageUrl = '';

  // Cart
  qty = 1;
  cart: { product: Product, qty: number }[] = [];

  // Review form
  newReview: Review = { rating: 0, comment: '' };
  hoverRating = 0;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct(id);
    this.loadReviews(id);
  }


loadProduct(id: number): void {
  this.loading = true;
  this.productService.getById(id).subscribe({
    next: (data) => {
      this.product = data;
      // Sélectionner l'image primaire par défaut
      if (data.images && data.images.length > 0) {
        const primary = data.images.find(i => i.isPrimary);
        this.selectedImageUrl = primary
          ? primary.imageUrl
          : data.images[0].imageUrl;
      }
      this.loading = false;
    },
    error: (err) => { console.error(err); this.loading = false; }
  });
}

getPrimaryImage(): string {
  return this.selectedImageUrl ||
    (this.product?.images?.[0]?.imageUrl ?? '');
}
  

  loadReviews(id: number): void {
    this.reviewService.getByProduct(id).subscribe({
      next: (data) => {
        this.reviews = data;
        if (data.length > 0) {
          this.averageRating = parseFloat(
            (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1)
          );
        }
      },
      error: (err) => console.error(err)
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cart.push({ product: this.product, qty: this.qty });
    this.showMessage('Added to cart ✅', 'success');
  }

  goToCheckout(): void {
    this.router.navigate(['/marketplace/checkout'], {
      state: { cart: this.cart }
    });
  }

  goBack(): void {
    this.router.navigate(['/marketplace']);
  }

  // Stars
  setRating(n: number): void { this.newReview.rating = n; }
  setHover(n: number): void  { this.hoverRating = n; }
  clearHover(): void         { this.hoverRating = 0; }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) =>
      i < Math.floor(rating) ? '★' : '☆'
    );
  }

  submitReview(): void {
    this.submitted = true;
    if (!this.newReview.rating || this.newReview.rating === 0) {
      this.showMessage('Please select a rating ⚠️', 'error');
      return;
    }

    this.reviewService.create(
      this.newReview,
      this.buyerId,
      this.product!.id!
    ).subscribe({
      next: () => {
        this.showMessage('Review submitted ✅', 'success');
        this.newReview = { rating: 0, comment: '' };
        this.submitted = false;
        this.loadReviews(this.product!.id!);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error submitting review ❌', 'error');
      }
    });
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}