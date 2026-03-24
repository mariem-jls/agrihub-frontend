import { Component, OnInit } from '@angular/core';
import {
  TransactionsService,
  TransactionDTO,
} from '../../../core/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  loading = false;
  transactions: TransactionDTO[] = [];
  filteredTransactions: TransactionDTO[] = [];

  searchText: string = '';

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.loading = true;
    this.transactionsService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  applyFilter() {
    this.filteredTransactions = this.transactions.filter(
      (t) =>
        t.userName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(this.searchText.toLowerCase()) ||
        t.transactionType.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }
}
