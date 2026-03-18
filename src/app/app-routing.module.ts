import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'seller',
    loadChildren: () =>
      import('./seller/seller.module')
        .then(m => m.SellerModule)
  },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./marketplace/marketplace.module')
        .then(m => m.MarketplaceModule)
  },
  {
    path: '',
    redirectTo: 'marketplace',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
