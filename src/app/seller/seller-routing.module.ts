import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { FundingProjectComponent } from './components/funding-project/funding-project.component';
import { ContributionsComponent } from './components/contributions/contributions.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'funding-projects', component: FundingProjectComponent },
  { path: 'contributions', component: ContributionsComponent },
  { path: 'wallets', component: WalletsComponent },
  { path: 'transactions', component: TransactionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
