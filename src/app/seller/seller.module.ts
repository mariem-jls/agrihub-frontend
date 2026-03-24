import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SellerRoutingModule } from './seller-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductImageUploadComponent } from './components/product-image-upload/product-image-upload.component';
import { FundingProjectComponent } from './components/funding-project/funding-project.component';
import { ContributionsComponent } from './components/contributions/contributions.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { TransactionsComponent } from './components/transactions/transactions.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProductListComponent,
    ProductFormComponent,
    OrderListComponent,
    ProductImageUploadComponent,
    FundingProjectComponent,
    ContributionsComponent,
    WalletsComponent,
    TransactionsComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SellerRoutingModule,
    RouterModule    ,
        
  ]
})
export class SellerModule { }
