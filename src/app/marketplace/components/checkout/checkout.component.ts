import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Product } from '../../../core/models/product.model';
import { PaymentMethod } from '../../../core/models/payment.model';

// 1. Interface pour le panier
interface CartItem {
  product: Product;
  qty: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  buyerId = 2;
  cart: CartItem[] = [];                 // ← typé avec CartItem
  loading = false;
  confirmed = false;
  confirmedOrderNumbers: string[] = [];
  message = '';
  messageType = '';

  deliveryAddress = '';
  paymentMethod: PaymentMethod = 'CASH_ON_DELIVERY';
  submitted = false;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    if (state?.cart) {
      this.cart = state.cart;
    } else {
      const s = history.state;
      if (s?.cart) this.cart = s.cart;
    }
  }

  get total(): number {
    return parseFloat(
      this.cart.reduce(
        (s, i) => s + i.product.price * i.qty, 0
      ).toFixed(2)
    );
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
  }

  isAddressInvalid(): boolean {
    return this.submitted && (!this.deliveryAddress || this.deliveryAddress.trim() === '');
  }

  placeOrder(): void {
    this.submitted = true;

    if (!this.deliveryAddress || this.deliveryAddress.trim() === '') {
      this.showMessage('Please enter a delivery address ⚠️', 'error');
      return;
    }

    if (this.cart.length === 0) {
      this.showMessage('Your cart is empty ⚠️', 'error');
      return;
    }

    // Grouper par sellerId
    const bySeller: { [key: number]: CartItem[] } = {};   // ← typé avec CartItem[]
    this.cart.forEach(item => {
      const sid = item.product.sellerId!;
      if (!bySeller[sid]) bySeller[sid] = [];
      bySeller[sid].push(item);
    });

    const sellerIds = Object.keys(bySeller).map(Number);
    let completed = 0;
    this.loading = true;

    sellerIds.forEach(sellerId => {
      const items = bySeller[sellerId];
      const order = {
        sellerId,
        deliveryAddress: this.deliveryAddress,
        items: items.map((i: CartItem) => ({   // ← paramètre typé
          product: { id: i.product.id! },
          quantity: i.qty
        }))
      };

      this.orderService.create(order as any, this.buyerId).subscribe({
        next: (createdOrder) => {
          this.confirmedOrderNumbers.push(createdOrder.orderNumber!);
          this.paymentService.create(createdOrder.id!, this.paymentMethod).subscribe();
          completed++;
          if (completed === sellerIds.length) {
            this.loading = false;
            this.confirmed = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.showMessage('Error placing order ❌', 'error');
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/marketplace']);
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}