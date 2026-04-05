import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SellerRoutingModule } from './seller-routing.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProductImageUploadComponent } from './components/product-image-upload/product-image-upload.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductImageUploadComponent,
    OrderListComponent,
    UserListComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SellerRoutingModule
  ]
})
export class SellerModule { }
