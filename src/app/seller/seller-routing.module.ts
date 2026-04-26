import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerLayoutComponent } from './layout/seller-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { DemandesComponent } from './components/demandes/demandes.component';
import { RessourcesComponent } from './components/ressources/ressources.component';
import { FundingProjectComponent } from './components/funding-project/funding-project.component';
import { ContributionsComponent } from './components/contributions/contributions.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ReclamationsComponent } from './components/reclamations/reclamations.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  { path: '',         component: DashboardComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/add',      component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'orders',   component: OrderListComponent },
  { path: 'ressources', component: RessourcesComponent },
  { path: 'demandes', component: DemandesComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'funding-projects', component: FundingProjectComponent },
  { path: 'contributions', component: ContributionsComponent },
  { path: 'wallets', component: WalletsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'reclamations', component: ReclamationsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/add', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
