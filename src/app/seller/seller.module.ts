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
import { DemandesComponent } from './components/demandes/demandes.component';
import { RessourcesComponent } from './components/ressources/ressources.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProductListComponent,
    ProductFormComponent,
    OrderListComponent,
    ProductImageUploadComponent,
    DemandesComponent,
    RessourcesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SellerRoutingModule,
    RouterModule        
  ]
})
export class SellerModule { }
