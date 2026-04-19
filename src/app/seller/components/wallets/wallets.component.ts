import { Component, OnInit } from '@angular/core';
import {
  WalletsService,
  WalletDTO,
} from '../../../core/services/wallet.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css'],
})
export class WalletsComponent implements OnInit {
  loading = false;
  wallets: WalletDTO[] = [];
  filteredWallets: WalletDTO[] = [];
  searchText: string = '';

  constructor(private walletService: WalletsService) {}

  ngOnInit(): void {
    this.fetchWallets();
  }

  fetchWallets() {
    this.loading = true;
    this.walletService.getAllWallets().subscribe({
      next: (data) => {
        this.wallets = data;
        this.filteredWallets = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();
    this.filteredWallets = this.wallets.filter(
      (w) =>
        w.userNom?.toLowerCase().includes(text) ||
        w.userEmail?.toLowerCase().includes(text),
    );
  }
}
